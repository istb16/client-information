import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App.svelte';

const mockApiResponse = {
  remoteIpAddress: '203.0.113.1',
  remoteHostName: 'example.com',
  headers: [
    { key: 'User-Agent', value: 'Mozilla/5.0 (Test)' },
    { key: 'Accept', value: 'text/html' },
  ],
  cookies: [
    { key: '_ga', value: 'GA1.2.123456' },
  ],
};

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: () => Promise.resolve(mockApiResponse),
  } as Response);

  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  // --- 初期表示 ---

  it('ローディング中は "Now Loading..." を表示する', () => {
    render(App);
    expect(screen.getByText('Now Loading...')).toBeInTheDocument();
  });

  it('API レスポンス後に IP アドレスを表示する', async () => {
    render(App);
    await waitFor(() =>
      expect(screen.getByDisplayValue('203.0.113.1')).toBeInTheDocument()
    );
  });

  it('API レスポンス後はローディング表示が消える', async () => {
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    expect(screen.queryByText('Now Loading...')).not.toBeInTheDocument();
  });

  it('ホスト名とユーザーエージェントを表示する', async () => {
    render(App);
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
      // User-Agent は info-grid とヘッダーテーブルの両方に表示される
      expect(screen.getAllByText('Mozilla/5.0 (Test)').length).toBeGreaterThan(0);
    });
  });

  it('ヘッダーテーブルを正しく表示する', async () => {
    render(App);
    await waitFor(() => {
      expect(screen.getByText('Accept')).toBeInTheDocument();
      expect(screen.getByText('text/html')).toBeInTheDocument();
    });
  });

  it('クッキーテーブルを正しく表示する', async () => {
    render(App);
    await waitFor(() => {
      expect(screen.getByText('_ga')).toBeInTheDocument();
      expect(screen.getByText('GA1.2.123456')).toBeInTheDocument();
    });
  });

  // --- コピー機能 ---

  it('コピーボタンをクリックすると clipboard.writeText が IP アドレスで呼ばれる', async () => {
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    await fireEvent.click(screen.getByTitle('コピー'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('203.0.113.1');
  });

  it('コピーボタンをクリックすると "Copied!" が表示される', async () => {
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    await fireEvent.click(screen.getByTitle('コピー'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  // --- タイマー ---

  describe('"Copied!" タイマー', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('"Copied!" は 2000ms 後に消える', async () => {
      render(App);
      await vi.runAllTimersAsync(); // fetch + onMount + tick を解決

      expect(screen.getByDisplayValue('203.0.113.1')).toBeInTheDocument();

      fireEvent.click(screen.getByTitle('コピー'));
      // runAllTimersAsync は 2000ms の setTimeout まで消化してしまうため
      // マイクロタスク（clipboard.writeText の Promise）だけを flush する
      await Promise.resolve();
      await Promise.resolve();

      expect(screen.getByText('Copied!')).toBeInTheDocument();

      vi.advanceTimersByTime(2000);
      await Promise.resolve(); // Svelte の DOM 更新を待つ

      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
  });

  // --- DOM 操作 ---

  it('IP フィールドにフォーカスすると全選択される', async () => {
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    const input = screen.getByDisplayValue('203.0.113.1') as HTMLInputElement;
    const selectSpy = vi.spyOn(input, 'select');
    await fireEvent.focus(input);
    expect(selectSpy).toHaveBeenCalled();
  });

  // --- API 呼び出し検証 ---

  it('正しい API URL と CORS オプションで fetch が呼ばれる', async () => {
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    expect(fetch).toHaveBeenCalledWith(
      'https://rpdyxad9y2.execute-api.ap-northeast-1.amazonaws.com/Prod/dump',
      { mode: 'cors', cache: 'no-cache' }
    );
  });

  // --- エラー・エッジケース ---

  it('fetch が失敗してもクラッシュせずローディング表示を維持する', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error('Network error'));
    render(App);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await Promise.resolve(); // catch {} の処理完了を待つ
    expect(screen.getByText('Now Loading...')).toBeInTheDocument();
  });

  it('User-Agent ヘッダーが存在しない場合はユーザーエージェントが空になる', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({
        ...mockApiResponse,
        headers: [{ key: 'Accept', value: 'text/html' }],
      }),
    } as Response);
    render(App);
    await waitFor(() => screen.getByDisplayValue('203.0.113.1'));
    const userAgentValue = screen.getByText('User Agent').nextElementSibling;
    expect(userAgentValue?.textContent).toBe('');
  });

  // --- 複数データ ---

  it('ヘッダーが複数件あるとき全件描画される', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({
        ...mockApiResponse,
        headers: [
          { key: 'User-Agent', value: 'Mozilla/5.0 (Test)' },
          { key: 'Accept', value: 'text/html' },
          { key: 'Accept-Language', value: 'ja-JP' },
          { key: 'X-Forwarded-For', value: '10.0.0.1' },
        ],
      }),
    } as Response);
    render(App);
    await waitFor(() => {
      expect(screen.getByText('Accept-Language')).toBeInTheDocument();
      expect(screen.getByText('ja-JP')).toBeInTheDocument();
      expect(screen.getByText('X-Forwarded-For')).toBeInTheDocument();
      expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
    });
  });

  it('クッキーが複数件あるとき全件描画される', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({
        ...mockApiResponse,
        cookies: [
          { key: '_ga', value: 'GA1.2.123456' },
          { key: '_gid', value: 'GA1.2.789' },
          { key: 'session', value: 'abc123' },
        ],
      }),
    } as Response);
    render(App);
    await waitFor(() => {
      expect(screen.getByText('_gid')).toBeInTheDocument();
      expect(screen.getByText('session')).toBeInTheDocument();
      expect(screen.getByText('abc123')).toBeInTheDocument();
    });
  });
});

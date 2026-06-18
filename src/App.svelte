<script lang="ts">
  import { onMount, tick } from "svelte";

  type KeyValue = { key: string; value: string };

  let ipaddress = $state("");
  let useragent = $state("");
  let hostname = $state("");
  let headers = $state<KeyValue[]>([]);
  let cookies = $state<KeyValue[]>([]);
  let loading = $state(true);
  let copied = $state(false);

  const getClientValues = async () => {
    const url = "https://rpdyxad9y2.execute-api.ap-northeast-1.amazonaws.com/Prod/dump";
    try {
      const res = await fetch(url, { mode: "cors", cache: "no-cache" });
      const values = await res.json();
      ipaddress = values.remoteIpAddress;
      hostname = values.remoteHostName;
      useragent = values.headers.find((h: KeyValue) => h.key === "User-Agent")?.value ?? "";
      headers = values.headers as KeyValue[];
      cookies = values.cookies as KeyValue[];
      loading = false;
      await tick();
      (document.getElementById("ipaddress") as HTMLInputElement).select();
    } catch {}
  };

  const copyIpAddress = async () => {
    await navigator.clipboard.writeText(ipaddress);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

  const focusedIpAddress = (e: FocusEvent) => {
    (e.currentTarget as HTMLInputElement).select();
  };

  onMount(getClientValues);
</script>

<header>
  <div class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  </div>
  <div class="header-text">
    <span class="app-title">Client Information</span>
    <span class="app-subtitle">あなたのネットワーク情報を表示します</span>
  </div>
</header>

{#if loading}
  <div class="loading-wrap">
    <div class="spinner"></div>
    <span class="loading-text">Now Loading...</span>
  </div>
{:else}
  <main>
    <section class="card">
      <div class="card-head">
        <span class="card-label">IP アドレス</span>
        <button class="action-btn" title="コピー" onclick={copyIpAddress}>
          {#if copied}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Copied!
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            コピー
          {/if}
        </button>
      </div>
      <div class="card-body ip-body">
        <input
          type="text"
          id="ipaddress"
          class="ip-input"
          bind:value={ipaddress}
          onfocus={focusedIpAddress}
          readonly
        />
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <span class="card-label">情報</span>
      </div>
      <div class="info-list">
        <div class="info-row">
          <span class="info-key">Host Name</span>
          <span class="info-val">{hostname}</span>
        </div>
        <div class="info-row">
          <span class="info-key">User Agent</span>
          <span class="info-val">{useragent}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <span class="card-label">Header</span>
        <span class="badge">{headers.length}</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {#each headers as row}
            <tr>
              <td class="key-cell">{row.key}</td>
              <td>{row.value}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    {#if cookies.length > 0}
      <section class="card">
        <div class="card-head">
          <span class="card-label">Cookie</span>
          <span class="badge">{cookies.length}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {#each cookies as row}
              <tr>
                <td class="key-cell">{row.key}</td>
                <td>{row.value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/if}
  </main>
{/if}

<footer>&copy; tk3.biz 2026</footer>

<style>
  /* ── Header ── */
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 64px;
    padding: 0 24px;
    background: #fff;
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(145deg, #5b9cf6, #4a7cf7);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(74, 124, 247, 0.35);
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .app-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: 0.01em;
  }

  .app-subtitle {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  /* ── Loading ── */
  .loading-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 64px);
  }

  .loading-text {
    margin-top: 14px;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent-end);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Main layout ── */
  main {
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 16px 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Card ── */
  .card {
    background: var(--color-card);
    border-radius: var(--radius-card);
    border: 1px solid var(--color-border);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid var(--color-border);
  }

  .card-label {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .card-body {
    padding: 20px;
  }

  /* ── IP input ── */
  .ip-body {
    padding: 20px 20px 22px;
  }

  .ip-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--color-text);
    font-family: inherit;
    letter-spacing: 0.03em;
    cursor: text;
  }

  /* ── Action button ── */
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    font-family: inherit;
  }

  .action-btn:hover {
    background: var(--color-row-hover);
    border-color: rgba(0, 0, 0, 0.18);
    color: var(--color-text);
  }

  /* ── Badge ── */
  .badge {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-accent-end);
    background: rgba(74, 124, 247, 0.1);
    border-radius: 20px;
    padding: 2px 8px;
    letter-spacing: 0.02em;
  }

  /* ── Info list ── */
  .info-list {
    padding: 4px 0;
  }

  .info-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: 11px 20px;
    border-bottom: 1px solid var(--color-border);
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-key {
    flex-shrink: 0;
    width: 100px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .info-val {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    word-break: break-all;
  }

  /* ── Data table ── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead tr {
    border-bottom: 1px solid var(--color-border);
  }

  .data-table th {
    padding: 10px 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    text-align: left;
    background: var(--color-row-hover);
  }

  .data-table td {
    padding: 10px 20px;
    font-size: 0.855rem;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border);
    vertical-align: middle;
    word-break: break-all;
  }

  .data-table tbody tr:last-child td {
    border-bottom: none;
  }

  .data-table tbody tr:hover td {
    background: var(--color-row-hover);
  }

  .key-cell {
    font-weight: 500;
    color: var(--color-text) !important;
    white-space: nowrap;
    word-break: normal !important;
    width: 1%;
  }

  /* ── Footer ── */
  footer {
    text-align: center;
    padding: 20px;
    font-size: 0.78rem;
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
  }
</style>

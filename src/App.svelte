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
  <h1>Client Information</h1>
</header>
<main>
  <h1>あなたの利用している情報は・・・</h1>
  {#if loading}
    Now Loading...
  {:else}
    <div class="ip-row mb-3">
      <div class="form-floating flex-grow-1">
        <input
          type="text"
          id="ipaddress"
          class="form-control form-control-lg"
          bind:value={ipaddress}
          onfocus={focusedIpAddress}
          readonly
        />
        <label for="ipaddress">IP Address</label>
      </div>
      <button class="copy-btn" onclick={copyIpAddress} title="コピー">
        {#if copied}
          <span class="copy-label">Copied!</span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        {/if}
      </button>
    </div>
    <div class="info-grid mb-3">
      <div class="row">
        <div class="col-auto">Host Name</div>
        <div class="col">{hostname}</div>
      </div>
      <div class="row">
        <div class="col-auto">User Agent</div>
        <div class="col">{useragent}</div>
      </div>
    </div>

    <h2>Header</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {#each headers as d}
          <tr>
            <th>{d.key}</th>
            <td>{d.value}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Cookie</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {#each cookies as d}
          <tr>
            <th>{d.key}</th>
            <td>{d.value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>
<footer>&copy; tk3.biz 2026</footer>

<style>
  header {
    display: flex;
    align-items: center;
    background-color: var(--color-bg);
    margin: -8px -8px 3rem;
    padding: 0 24px;
    height: 64px;
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  header h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  header h1::before {
    content: '';
    width: 3px;
    height: 1.1em;
    background-color: var(--color-accent);
    border-radius: 2px;
    flex-shrink: 0;
  }

  main {
    max-width: 768px;
    margin: auto;
    padding: 0 16px;
  }

  main h1 {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  main h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-border);
  }

  main h2::before {
    content: '';
    width: 12px;
    height: 2px;
    background-color: var(--color-accent);
    flex-shrink: 0;
  }

  .ip-row {
    display: flex;
    align-items: stretch;
    gap: 8px;
  }

  .copy-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    padding: 0 14px;
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  .copy-btn:hover {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }

  .copy-label {
    white-space: nowrap;
  }

  .info-grid {
    background-color: var(--color-bg-subtle);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 1rem 1.25rem;
  }

  .info-grid .row {
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .info-grid .row:last-child {
    border-bottom: none;
  }

  .info-grid .col-auto {
    min-width: 110px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
  }

  .info-grid .col {
    font-size: 0.9rem;
    word-break: break-all;
  }

  footer {
    margin: 4rem -8px -8px;
    padding: 16px 24px;
    background-color: var(--color-bg-subtle);
    color: var(--color-text-muted);
    border-top: 1px solid var(--color-border);
    font-size: 0.82rem;
    text-align: center;
    letter-spacing: 0.04em;
  }
</style>

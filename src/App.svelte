<script lang="ts">
  import { onMount } from "svelte";

  let ipaddress = $state("");
  let useragent = $state("");
  let hostname = $state("");
  let headers = $state<{ key: string; value: string }[]>([]);
  let cookies = $state<{ key: string; value: string }[]>([]);
  let loading = $state(true);

  const getClientValues = async () => {
    headers.length = 0;
    cookies.length = 0;
    const url =
      "https://rpdyxad9y2.execute-api.ap-northeast-1.amazonaws.com/Prod/dump";

    try {
      const res = await fetch(url, { mode: "cors", cache: "no-cache" });
      const values = await res.json();
      ipaddress = values.remoteIpAddress;
      hostname = values.remoteHostName;
      useragent = values.headers.find((h: { key: string }) => h.key == "User-Agent")?.value;
      values.headers.forEach((h: { key: string; value: string }) => {
        headers.push({ key: h.key, value: h.value });
      });
      values.cookies.forEach((h: { key: string; value: string }) => {
        cookies.push({ key: h.key, value: h.value });
      });

      loading = false;

      const tb = document.getElementById("ipaddress") as HTMLInputElement;
      tb.select();
    } catch {}
  };

  const focusedIpAddress = (e: FocusEvent) => {
    (e.currentTarget as HTMLInputElement).select();
  };

  onMount(async () => {
    await getClientValues();
  });
</script>

<header>
  <h1>Client Information</h1>
</header>
<main>
  <h1>あなたの利用している情報は・・・</h1>
  {#if loading}
    Now Loading...
  {:else}
    <div class="form-floating mb-3">
      <input
        type="text"
        id="ipaddress"
        class="form-control form-control-lg"
        bind:value={ipaddress}
        onfocus={focusedIpAddress}
      />
      <label for="ipaddress">IP Address</label>
    </div>
    <div>
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
<footer>&copy; tk3.biz 2022</footer>

<style>
  header {
    display: flex;
    justify-content: normal;
    align-items: center;
    background-color: #393e46;
    margin: -8px -8px 3rem -8px;
  }

  header h1 {
    margin: 8px 5px 5px 13px;
    color: #fff;
  }

  main {
    max-width: 768px;
    margin: auto;
  }
  main h1 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  main h2 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  footer {
    background-color: #393e46;
    margin: 3rem -8px -8px -8px;
    padding: 8px;
    color: #fff;
  }
</style>

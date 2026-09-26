<script>
  import { createEventDispatcher, onDestroy, tick } from 'svelte'
  import { BrowserMultiFormatReader } from '@zxing/browser'
  import { success as vibrarSucesso, error as vibrarErro } from '../lib/haptics.js'
  const dispatch = createEventDispatcher()

  const CHAVE_STORAGE = 'mercado-calc:camera-preferida-id'

  let videoEl
  let controls = null
  let erro = null
  let lendo = false
  let leitorJaLeu = false
  let dispositivos = []
  let indiceAtual = 0

  function salvarCameraPreferida(deviceId) {
    try { localStorage.setItem(CHAVE_STORAGE, deviceId) } catch { /* ignora se storage bloqueado */ }
  }

  function lerCameraPreferida() {
    try { return localStorage.getItem(CHAVE_STORAGE) } catch { return null }
  }

  async function carregarDispositivos() {
    try {
      dispositivos = await BrowserMultiFormatReader.listVideoInputDevices()
    } catch {
      dispositivos = []
    }
  }

  async function iniciar() {
    erro = null
    leitorJaLeu = false
    lendo = true
    await tick() // garante que o <video> já existe na tela antes de usar ele

    const reader = new BrowserMultiFormatReader()
    const preferidaId = lerCameraPreferida()

    try {
      if (preferidaId) {
        // já sabemos qual câmera funciona nesse aparelho — usa direto, sem perguntar de novo
        await carregarDispositivos()
        const idx = dispositivos.findIndex(d => d.deviceId === preferidaId)
        if (idx >= 0) {
          indiceAtual = idx
          controls = await reader.decodeFromVideoDevice(preferidaId, videoEl, aoDecodificar)
          return
        }
        // a câmera salva não existe mais nesse aparelho (trocou de celular, etc) — esquece e recomeça
        try { localStorage.removeItem(CHAVE_STORAGE) } catch {}
      }

      // primeira vez nesse aparelho: pede a câmera de trás genérica
      controls = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        videoEl,
        aoDecodificar
      )
      await carregarDispositivos()

      // confere se pegou a câmera principal ou uma secundária (ultra-wide/tele) e já corrige
      const deviceIdAtual = videoEl.srcObject?.getVideoTracks?.()[0]?.getSettings?.()?.deviceId
      const principal = dispositivos.findIndex(d =>
        /back|traseira|rear/i.test(d.label) && !/ultra|wide|tele|macro/i.test(d.label)
      )
      if (principal >= 0 && dispositivos[principal].deviceId !== deviceIdAtual) {
        indiceAtual = principal
        controls.stop()
        controls = await reader.decodeFromVideoDevice(dispositivos[principal].deviceId, videoEl, aoDecodificar)
      } else {
        indiceAtual = dispositivos.findIndex(d => d.deviceId === deviceIdAtual)
        if (indiceAtual < 0) indiceAtual = 0
      }
    } catch (e) {
      lendo = false
      vibrarErro()
      if (e?.name === 'NotAllowedError') {
        erro = 'Permissão de câmera negada. Libera o acesso nas configurações do navegador.'
      } else if (e?.name === 'NotFoundError') {
        erro = 'Não achei nenhuma câmera nesse dispositivo.'
      } else {
        erro = 'Não consegui acessar a câmera: ' + (e?.message || 'erro desconhecido')
      }
    }
  }

  function aoDecodificar(result) {
    if (result && !leitorJaLeu) {
      leitorJaLeu = true
      vibrarSucesso()
      // funcionou! guarda essa câmera como a certa pra esse aparelho, não pergunta mais
      if (dispositivos[indiceAtual]) salvarCameraPreferida(dispositivos[indiceAtual].deviceId)
      const codigo = result.getText()
      pararCamera()
      dispatch('scan', { codigo })
    }
  }

  async function trocarCamera() {
    if (dispositivos.length < 2) return
    controls?.stop()
    controls = null
    indiceAtual = (indiceAtual + 1) % dispositivos.length
    const reader = new BrowserMultiFormatReader()
    controls = await reader.decodeFromVideoDevice(dispositivos[indiceAtual].deviceId, videoEl, aoDecodificar)
  }

  function pararCamera() {
    lendo = false
    controls?.stop()
    controls = null
  }

  onDestroy(pararCamera)
</script>

<div class="scanner glass">
  {#if !lendo}
    <button class="btn-iniciar" on:click={iniciar}>
      Escanear código de barras
    </button>
  {:else}
    <div class="video-wrap">
      <video bind:this={videoEl} autoplay playsinline muted></video>
      <div class="mira" aria-hidden="true"></div>
    </div>
    <div class="botoes-linha">
      <button class="btn-cancelar" on:click={pararCamera}>Cancelar</button>
      {#if dispositivos.length > 1}
        <button class="btn-trocar" on:click={trocarCamera}>🔄 Trocar câmera ({indiceAtual + 1}/{dispositivos.length})</button>
      {/if}
    </div>
  {/if}
  {#if erro}<p class="erro">{erro}</p>{/if}
</div>

<style>
  .scanner {
    padding: 16px;
    border-radius: var(--radius-xl);
    text-align: center;
  }
  .btn-iniciar {
    width: 100%;
    padding: 16px;
    border-radius: var(--radius-lg);
    border: none;
    background: var(--accent);
    color: var(--surface);
    font-family: var(--font-main);
    font-weight: 900;
    font-size: 16px;
  }
  .video-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: #000;
  }
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mira {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 30%;
    bottom: 30%;
    border: 3px solid var(--accent2);
    border-radius: var(--radius-md);
    pointer-events: none;
  }
  .botoes-linha {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .btn-cancelar, .btn-trocar {
    flex: 1;
    padding: 10px 14px;
    border-radius: var(--radius-pill);
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--text2);
    font-weight: 700;
    font-size: 13px;
  }
  .erro {
    color: var(--red);
    font-size: 13px;
    margin-top: 8px;
  }
</style>

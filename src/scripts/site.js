const pages = [
  ["Home", "index.html", "Home"],
  ["Explore", "explore.html", "Explore"],
  ["Support", "donos.html", "Creator support"],
  ["Launch", "launch.html", "Launch"],
  ["Flow", "flow.html", "Capital flow"],
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const pageTitles = {
  "index.html": "Home · Trendify",
  "explore.html": "Explore · Trendify",
  "donos.html": "Creator Support · Trendify",
  "launch.html": "Launch · Trendify",
  "flow.html": "Capital Flow · Trendify",
  "docs.html": "Docs · Trendify",
};
const textReplacements = [
  [/Launch a token\. Back the stream\./gi, "Launch a token. Back TikTok creators."],
  [/Back the stream\./gi, "Back TikTok creators."],
  [/^Donos$/gi, "Creator support"],
  [/What is dono\?/gi, "What is Trendify?"],
  [/Funding is the start\. Delivery is the dono\./gi, "Funding starts support. Delivery completes it."],
  [/Support a streamer/gi, "Support a TikTok creator"],
  [/Top streamers/gi, "Top TikTok creators"],
  [/Streamer payouts/gi, "TikTok creator payouts"],
  [/streamer being live/gi, "TikTok account being active"],
  [/is offline/gi, "has no recent TikTok activity"],
  [/@\s*twitch_username/gi, "@tiktok_creator"],
  [/twitch_username/gi, "tiktok_creator"],
  [/@your_streamer/gi, "@tiktok_creator"],
  [/@donotoyou/gi, "@trendify"],
  [/@donodotyou/gi, "@trendify"],
  [/Chat Cat/gi, "TikTok Star"],
  [/^CHAT$/gi, "TOK"],
  [/\bchat\b/gi, "comments and likes"],
  [/gifted subs/gi, "creator rewards"],
  [/gift sub/gi, "creator reward"],
  [/\bTwitch\b/gi, "TikTok"],
  [/\bKick\b/gi, "TikTok"],
  [/\blivestreamers\b/gi, "TikTok creators"],
  [/\blivestreamer\b/gi, "TikTok creator"],
  [/\blivestreams\b/gi, "TikTok videos"],
  [/\blivestream\b/gi, "TikTok video"],
  [/\bstreamers\b/gi, "TikTok creators"],
  [/\bstreamer\b/gi, "TikTok creator"],
  [/\bstreaming\b/gi, "TikTok creation"],
  [/\bstreams\b/gi, "TikTok videos"],
  [/\bstream\b/gi, "TikTok video"],
  [/\bdonations\b/gi, "creator support"],
  [/\bdonation\b/gi, "creator support"],
  [/\bgifts\b/gi, "creator support"],
  [/\bgift\b/gi, "support"],
  [/\bdono['’]d\b/gi, "supported"],
  [/\bdonos\b/gi, "creator support"],
  [/\bdono\b/gi, "Trendify"],
  [/TikTok creator is live/gi, "TikTok creator is active"],
  [/TikTok TikTok creator/gi, "TikTok creator"],
  [/live-status/gi, "account activity"],
  [/\bchannel\b/gi, "TikTok account"],
  [/TikTok\s+TikTok/gi, "TikTok"],
];

function rewriteText(value) {
  return textReplacements.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  );
}

document.title = pageTitles[currentPage] || "Trendify";
const description = document.querySelector('meta[name="description"]');
if (description) {
  description.content = "Trendify launches community tokens that turn creator fees into transparent support for TikTok creators.";
}

const youtubeCandidates = new Set(
  document.querySelectorAll(
    ".lv-platform-soon img, .hero-platform-soon img, .public-platform-soon img",
  ),
);

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (walker.nextNode()) textNodes.push(walker.currentNode);
for (const node of textNodes) {
  if (!node.parentElement?.closest("script, style")) node.nodeValue = rewriteText(node.nodeValue);
}

for (const element of document.querySelectorAll("[aria-label], [alt], [title], [placeholder]")) {
  for (const attribute of ["aria-label", "alt", "title", "placeholder"]) {
    if (element.hasAttribute(attribute)) {
      element.setAttribute(attribute, rewriteText(element.getAttribute(attribute)));
    }
  }
}

for (const link of document.querySelectorAll('a[href*="twitch.tv/"]')) {
  const username = new URL(link.href).pathname.split("/").filter(Boolean)[0];
  if (username) link.href = `https://www.tiktok.com/@${username}`;
}

for (const brand of document.querySelectorAll(".brand")) {
  brand.innerHTML = brand.closest(".sidebar-account")
    ? '<img class="trendify-wordmark" src="assets/trendify-wordmark.jpg" alt="Trendify">'
    : '<img class="project-logo" src="assets/trendify-mark.jpg" alt="Trendify logo"><span class="tiktok-brand-name">Trendify</span>';
}

for (const logo of document.querySelectorAll('img[alt="Trendify"]')) {
  if (logo.closest(".sidebar-bottom")) {
    const replacement = document.createElement("span");
    replacement.className = "tiktok-footer-logo";
    replacement.innerHTML = '<img class="trendify-wordmark" src="assets/trendify-wordmark.jpg" alt="Trendify">';
    logo.replaceWith(replacement);
  } else {
    const replacement = document.createElement("img");
    replacement.className = "project-logo";
    replacement.src = "assets/trendify-mark.jpg";
    replacement.alt = "Trendify logo";
    logo.replaceWith(replacement);
  }
}

for (const icon of [...document.querySelectorAll("img[alt]")].filter(
  (image) => image.alt.toLowerCase() === "tiktok",
)) {
  const originalSource = icon.getAttribute("src") || "";
  let context = icon.parentElement;
  for (let depth = 0; context && depth < 2 && !/coming soon/i.test(context.textContent); depth += 1) {
    context = context.parentElement;
  }
  const isYouTube = youtubeCandidates.has(icon) || (
    /kick\.svg/i.test(originalSource) && Boolean(context && /coming soon/i.test(context.textContent))
  );
  const platform = isYouTube ? "YouTube" : "TikTok";
  const replacement = document.createElement("img");
  replacement.className = "tiktok-platform-icon";
  replacement.src = isYouTube ? "assets/youtube-logo.png" : "assets/tiktok-logo.png";
  replacement.alt = platform;
  icon.replaceWith(replacement);

  if (isYouTube) {
    const platformText = document.createTreeWalker(context, NodeFilter.SHOW_TEXT);
    while (platformText.nextNode()) {
      platformText.currentNode.nodeValue = platformText.currentNode.nodeValue.replace(/TikTok/g, "YouTube");
    }
  }
}

for (const illustration of document.querySelectorAll(".hero-coin")) {
  const replacement = document.createElement("span");
  replacement.className = `${illustration.className} tiktok-floating-icon`;
  replacement.setAttribute("aria-hidden", "true");
  replacement.textContent = illustration.classList.contains("hero-coin-fees") ? "♥" : "♫";
  illustration.replaceWith(replacement);
}

for (const socialGroup of document.querySelectorAll(".social-links")) {
  const links = [...socialGroup.querySelectorAll("a")];
  links.slice(2).forEach((link) => link.remove());
  if (links[0]) {
    links[0].href = "https://x.com/trendify";
    links[0].setAttribute("aria-label", "Trendify on X");
  }
  if (links[1]) {
    links[1].href = "https://www.tiktok.com/@trendify";
    links[1].setAttribute("aria-label", "Trendify on TikTok");
  }
}

for (const accountLink of document.querySelectorAll(".sidebar-account")) {
  accountLink.href = "https://x.com/trendify";
  accountLink.setAttribute("aria-label", "Trendify on X");
}

function initializeWalletConnector() {
  const walletTriggers = [...document.querySelectorAll("button")].filter(
    (button) => button.matches(".wallet-button") || /connect wallet/i.test(button.textContent),
  );
  if (!walletTriggers.length) return;

  const modal = document.createElement("div");
  modal.className = "wallet-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="wallet-modal-backdrop" data-wallet-close></div>
    <section class="wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title">
      <button class="wallet-dialog-close" type="button" aria-label="Close wallet dialog" data-wallet-close>×</button>
      <img class="project-logo" src="assets/trendify-mark.jpg" alt="Trendify logo">
      <h2 id="wallet-dialog-title">Connect wallet</h2>
      <p>Choose a wallet to continue with Trendify.</p>
      <div class="wallet-options">
        <button class="wallet-option" type="button" data-wallet="metamask">
          <img class="wallet-option-icon" src="assets/metamask-logo.svg" alt="" aria-hidden="true">
          <span><strong>MetaMask</strong><small>Ethereum wallet</small></span>
          <span aria-hidden="true">›</span>
        </button>
        <button class="wallet-option" type="button" data-wallet="phantom">
          <img class="wallet-option-icon" src="assets/phantom-logo.svg" alt="" aria-hidden="true">
          <span><strong>Phantom</strong><small>Solana wallet</small></span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <p class="wallet-dialog-status" role="status" aria-live="polite"></p>
    </section>
  `;
  document.body.append(modal);

  const dialog = modal.querySelector(".wallet-dialog");
  const status = modal.querySelector(".wallet-dialog-status");
  const metaMaskOption = modal.querySelector('[data-wallet="metamask"]');
  const phantomOption = modal.querySelector('[data-wallet="phantom"]');
  let announcedMetaMask = null;
  let lastFocused = null;

  function getMetaMask() {
    const ethereum = window.ethereum;
    return announcedMetaMask
      || ethereum?.providers?.find((provider) => provider.isMetaMask)
      || (ethereum?.isMetaMask ? ethereum : null);
  }

  function getPhantom() {
    return window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null);
  }

  function refreshAvailability() {
    const metaMaskHint = metaMaskOption.querySelector("small");
    const phantomHint = phantomOption.querySelector("small");
    if (metaMaskHint) metaMaskHint.textContent = getMetaMask()
      ? "Extension detected · Ethereum"
      : "Not detected · Install extension";
    if (phantomHint) phantomHint.textContent = getPhantom()
      ? "Extension detected · Solana"
      : "Not detected · Install extension";
  }

  function shortenAddress(address) {
    return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;
  }

  function updateWalletButtons(wallet, address) {
    const label = `${wallet} ${shortenAddress(address)}`;
    for (const trigger of walletTriggers) {
      const text = trigger.querySelector("span") || trigger;
      text.textContent = label;
      trigger.classList.add("is-connected");
      trigger.setAttribute("aria-label", `${wallet} wallet connected: ${address}`);
      trigger.disabled = false;
    }
  }

  function setStatus(message, state = "info") {
    status.textContent = message;
    status.dataset.state = state;
  }

  function setInstallStatus(wallet, url) {
    status.replaceChildren(
      `${wallet} is not available in this browser. Open Trendify in Chrome or Edge with the extension enabled. `,
    );
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `Install ${wallet}`;
    status.append(link);
    status.dataset.state = "error";
  }

  function openModal(event) {
    lastFocused = event.currentTarget;
    modal.hidden = false;
    document.body.classList.add("wallet-modal-open");
    setStatus("");
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    refreshAvailability();
    dialog.querySelector("[data-wallet]")?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("wallet-modal-open");
    lastFocused?.focus();
  }

  async function connectMetaMask() {
    const provider = getMetaMask();
    if (!provider) {
      setInstallStatus("MetaMask", "https://metamask.io/download/");
      return;
    }
    try {
      setStatus("Confirm the request in MetaMask…");
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts?.[0]) throw new Error("No account returned");
      updateWalletButtons("MetaMask", accounts[0]);
      setStatus("MetaMask connected.", "success");
      window.setTimeout(closeModal, 500);
    } catch (error) {
      const message = error?.code === 4001
        ? "Connection request rejected."
        : error?.code === -32002
          ? "A MetaMask connection request is already open."
          : "Could not connect MetaMask. Check that the extension is unlocked and allowed on this site.";
      setStatus(message, "error");
    }
  }

  async function connectPhantom() {
    const provider = getPhantom();
    if (!provider) {
      setInstallStatus("Phantom", "https://phantom.com/download");
      return;
    }
    try {
      setStatus("Confirm the request in Phantom…");
      const response = await provider.connect();
      const address = response?.publicKey?.toString() || provider.publicKey?.toString();
      if (!address) throw new Error("No public key returned");
      updateWalletButtons("Phantom", address);
      setStatus("Phantom connected.", "success");
      window.setTimeout(closeModal, 500);
    } catch (error) {
      setStatus(
        error?.code === 4001
          ? "Connection request rejected."
          : "Could not connect Phantom. Check that the extension is unlocked and allowed on this site.",
        "error",
      );
    }
  }

  walletTriggers.forEach((trigger) => {
    trigger.disabled = false;
    trigger.addEventListener("click", openModal);
  });
  modal.querySelectorAll("[data-wallet-close]").forEach((button) => button.addEventListener("click", closeModal));
  modal.querySelector('[data-wallet="metamask"]').addEventListener("click", connectMetaMask);
  modal.querySelector('[data-wallet="phantom"]').addEventListener("click", connectPhantom);
  window.addEventListener("eip6963:announceProvider", (event) => {
    const detail = event.detail;
    if (detail?.provider?.isMetaMask || detail?.info?.rdns === "io.metamask") {
      announcedMetaMask = detail.provider;
      refreshAvailability();
    }
  });
  window.addEventListener("phantom#initialized", refreshAvailability);
  window.addEventListener("solana#initialized", refreshAvailability);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  const metaMask = getMetaMask();
  metaMask?.request({ method: "eth_accounts" }).then((accounts) => {
    if (accounts?.[0]) updateWalletButtons("MetaMask", accounts[0]);
  }).catch(() => {});
  const phantom = getPhantom();
  if (phantom?.isConnected && phantom.publicKey) updateWalletButtons("Phantom", phantom.publicKey.toString());
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  refreshAvailability();
}

function initializeLaunchForm() {
  const form = document.querySelector(".lv-form");
  if (!form) return;

  const fields = [...form.querySelectorAll("input, textarea")];
  const fileInput = fields.find((field) => field.type === "file");
  const nameInput = fields.find((field) => field.placeholder === "TikTok Star");
  const tickerInput = fields.find((field) => field.placeholder === "TOK");
  const descriptionInput = fields.find((field) => field.tagName === "TEXTAREA");
  const xInput = fields.find((field) => field.type === "url");
  const creatorInput = fields.find((field) => field.placeholder === "tiktok_creator");
  const uploadButtons = form.querySelectorAll(".lv-upload, .lv-inline-action");
  const submitButton = form.querySelector('button[type="submit"]');
  const previewImage = document.querySelector(".lv-preview-cover img");
  const previewTitle = document.querySelector(".lv-preview-title");
  const previewStory = document.querySelector(".lv-preview-story");
  const beneficiary = document.querySelector(".lv-beneficiary");
  const formActions = submitButton?.parentElement;

  if (!fileInput || !nameInput || !tickerInput || !descriptionInput || !creatorInput || !submitButton) return;

  form.noValidate = true;

  const status = document.createElement("p");
  status.className = "trendify-form-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  formActions?.prepend(status);

  for (const button of uploadButtons) {
    button.addEventListener("click", () => fileInput.click());
  }

  function setStatus(message, state = "info") {
    status.textContent = message;
    status.dataset.state = state;
  }

  function updatePreview() {
    const tokenName = nameInput.value.trim() || "Token name";
    const ticker = tickerInput.value.trim().replace(/^\$/, "").toUpperCase().slice(0, 10) || "TICKER";
    const creator = creatorInput.value.trim().replace(/^@/, "") || "tiktok_creator";
    const titleName = previewTitle?.querySelector("strong") || previewTitle?.firstElementChild;
    const titleTicker = previewTitle?.querySelector("span") || previewTitle?.lastElementChild;

    if (titleName) titleName.textContent = tokenName;
    if (titleTicker) titleTicker.textContent = `$${ticker}`;
    if (previewStory) {
      previewStory.textContent = descriptionInput.value.trim() || "Your token description will appear here.";
      previewStory.classList.toggle("is-placeholder", !descriptionInput.value.trim());
    }
    if (beneficiary) {
      const handle = beneficiary.querySelector("strong");
      if (handle) handle.textContent = `@${creator}`;
    }
  }

  function handleArtwork() {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      fileInput.value = "";
      setStatus("Choose a PNG, JPG or WebP image.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      fileInput.value = "";
      setStatus("Artwork must be no larger than 2 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (previewImage) {
        previewImage.src = reader.result;
        previewImage.alt = `${nameInput.value.trim() || "Token"} artwork preview`;
      }
      for (const button of uploadButtons) button.classList.add("has-artwork");
      setStatus("Artwork added.", "success");
    });
    reader.readAsDataURL(file);
  }

  for (const field of [nameInput, tickerInput, descriptionInput, creatorInput]) {
    field.addEventListener("input", updatePreview);
  }
  tickerInput.addEventListener("input", () => {
    tickerInput.value = tickerInput.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 10);
  });
  creatorInput.addEventListener("input", () => {
    creatorInput.value = creatorInput.value.replace(/^@/, "").replace(/[^a-z0-9_]/gi, "").slice(0, 25);
    updatePreview();
  });
  fileInput.addEventListener("change", handleArtwork);

  submitButton.disabled = false;
  submitButton.textContent = "Create token draft";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = [];
    if (!fileInput.files?.[0]) missing.push("artwork");
    if (!nameInput.value.trim()) missing.push("token name");
    if (!tickerInput.value.trim()) missing.push("ticker");
    if (!creatorInput.value.trim()) missing.push("TikTok creator");
    if (missing.length) {
      setStatus(`Complete: ${missing.join(", ")}.`, "error");
      return;
    }

    if (nameInput.value.trim().length < 2 || tickerInput.value.trim().length < 2) {
      setStatus("Token name and ticker must contain at least 2 characters.", "error");
      return;
    }
    if (!/^[a-z0-9_]{3,25}$/i.test(creatorInput.value.trim())) {
      setStatus("Enter a valid TikTok username using letters, numbers or underscores.", "error");
      return;
    }
    if (xInput?.value.trim() && !/^https:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/.+/i.test(xInput.value.trim())) {
      setStatus("Enter a valid X profile link.", "error");
      return;
    }

    const draft = {
      name: nameInput.value.trim(),
      ticker: tickerInput.value.trim(),
      description: descriptionInput.value.trim(),
      xUrl: xInput?.value.trim() || "",
      creator: creatorInput.value.trim().replace(/^@/, ""),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("trendify-token-draft", JSON.stringify(draft));
    submitButton.textContent = "Draft created";
    setStatus("Token draft saved in this browser. Connect the production wallet backend to submit it on-chain.", "success");
  });

  updatePreview();
}

initializeLaunchForm();
initializeWalletConnector();

const launchedTokens = [
  { name: "ANSEM", handle: "ansem", ticker: "ANSEM", artwork: "assets/tokens/ansem.webp" },
  { name: "The Duve", handle: "jackduvaltrades", ticker: "DUVE", artwork: "assets/tokens/the-duve.webp" },
  { name: "kubilemeimei", handle: "kubilemeimei", ticker: "KUBILE", artwork: "assets/tokens/kubilemeimei.jpg" },
];

function configureLaunchedTokenCard(card, token) {
  const profileUrl = `https://www.tiktok.com/@${token.handle}`;
  card.classList.add("trendify-launched-token");
  card.removeAttribute("data-creator-rank");

  for (const link of card.querySelectorAll("a")) {
    link.href = profileUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.removeAttribute("data-discover");
  }

  const artLink = card.querySelector(".token-art-link");
  if (artLink) artLink.setAttribute("aria-label", `View ${token.name} on TikTok`);

  const artwork = card.querySelector(".token-card-art .token-image");
  if (artwork) {
    artwork.src = token.artwork;
    artwork.alt = `${token.name} artwork`;
    artwork.loading = "eager";
    artwork.dataset.imageState = "loaded";
  }

  const recipient = card.querySelector(".token-recipient-pill");
  const recipientName = recipient?.querySelector(":scope > span:last-child");
  const recipientAvatar = recipient?.querySelector(".avatar");
  if (recipientName) recipientName.textContent = token.name;
  if (recipientAvatar) {
    recipientAvatar.src = token.artwork;
    recipientAvatar.alt = `${token.name} portrait`;
    recipientAvatar.dataset.imageState = "loaded";
  }

  const title = card.querySelector(".token-card-title");
  const titleName = title?.querySelector("h3");
  const titleTicker = title?.querySelector("span");
  if (titleName) titleName.textContent = token.name;
  if (titleTicker) titleTicker.textContent = token.ticker;

  card.querySelectorAll(".token-card-figures strong").forEach((value) => {
    value.textContent = "$0";
  });
  card.querySelectorAll(".token-card-figures > span").forEach((group) => {
    group.title = "Just launched · No market activity yet.";
  });

  const statusLines = card.querySelectorAll(".token-funding-wait");
  if (statusLines[0]) statusLines[0].textContent = "Just launched · No market activity yet.";
  if (statusLines[1]) statusLines[1].textContent = "Unclaimed fees (est.): $0.00";

  const contract = card.querySelector(".token-contract");
  const contractText = contract?.querySelector("span");
  if (contract) contract.setAttribute("aria-label", `${token.name} token pending contract`);
  if (contractText) contractText.textContent = "Pending";
}

function initializeLaunchedTokenCards() {
  document.querySelectorAll(".token-grid").forEach((grid) => {
    const originalCards = [...grid.querySelectorAll(":scope > .token-card")];
    if (!originalCards.length || grid.querySelector(".trendify-launched-token")) return;
    const template = originalCards.find((card) => /ANSEM/i.test(card.textContent)) || originalCards[0];
    originalCards.forEach((card) => card.remove());

    const fragment = document.createDocumentFragment();
    launchedTokens.forEach((token) => {
      const card = template.cloneNode(true);
      configureLaunchedTokenCard(card, token);
      fragment.append(card);
    });
    grid.prepend(fragment);
  });

  const count = document.querySelector(".results-count");
  if (count) count.textContent = "Showing 3 of 3";
}

function initializeLaunchedSpotlight() {
  const strip = document.querySelector(".trending-strip");
  const template = strip?.querySelector(".trending-token");
  if (!strip || !template || strip.querySelector(".trendify-launched-spotlight")) return;
  strip.replaceChildren();

  launchedTokens.forEach((token) => {
    const item = template.cloneNode(true);
    item.classList.add("trendify-launched-spotlight");
    item.href = `https://www.tiktok.com/@${token.handle}`;
    item.target = "_blank";
    item.rel = "noreferrer";
    item.removeAttribute("data-discover");
    const image = item.querySelector("img");
    if (image) {
      image.src = token.artwork;
      image.alt = `${token.name} artwork`;
      image.dataset.imageState = "loaded";
    }
    const name = item.querySelector("strong");
    const ticker = item.querySelector("small");
    if (name) name.textContent = token.name;
    if (ticker) ticker.textContent = token.ticker;
    const amount = item.querySelector("span strong");
    if (amount) amount.textContent = "$0";
    strip.append(item);
  });
}

function initializeLaunchedTokenWall() {
  document.querySelectorAll(".token-wall-run").forEach((run) => {
    const template = run.querySelector(".mini-token");
    if (!template) return;
    run.replaceChildren();
    const group = document.createElement("div");
    group.className = "token-wall-group";

    launchedTokens.forEach((token) => {
      const item = template.cloneNode(true);
      const images = item.querySelectorAll("img.token-image");
      images.forEach((image) => {
        image.src = token.artwork;
        image.alt = image.classList.contains("avatar") ? `${token.name} portrait` : `${token.name} artwork`;
        image.dataset.imageState = "loaded";
      });
      const creatorLabel = item.querySelector(".mini-token-art span");
      if (creatorLabel) creatorLabel.lastChild.nodeValue = token.name;
      const name = item.querySelector(".mini-token-info strong");
      const metric = item.querySelector(".mini-token-info span");
      if (name) name.textContent = token.name;
      if (metric) metric.innerHTML = '$0 <small>MC</small>';
      group.append(item);
    });
    run.append(group);
  });
}

function configureProgressRow(row, token) {
  row.classList.add("trendify-launched-progress");
  row.setAttribute("aria-label", `${token.name} creator support progress`);
  const profileUrl = `https://www.tiktok.com/@${token.handle}`;
  const tokenLink = row.querySelector(".tdp-token");
  const tokenImage = row.querySelector(".token-art");
  const tokenName = tokenLink?.querySelector("strong");
  const tokenTicker = tokenLink?.querySelector("span span, :scope > span > span");
  if (tokenLink) tokenLink.href = profileUrl;
  if (tokenImage) {
    tokenImage.src = token.artwork;
    tokenImage.alt = `${token.name} artwork`;
    tokenImage.dataset.imageState = "loaded";
  }
  if (tokenName) tokenName.textContent = token.name;
  if (tokenTicker) tokenTicker.textContent = `$${token.ticker}`;

  const recipient = row.querySelector(".dr-recipient");
  const portrait = recipient?.querySelector(".dr-photo");
  const username = recipient?.querySelector(".dr-username");
  if (recipient) recipient.href = profileUrl;
  if (portrait) {
    portrait.src = token.artwork;
    portrait.alt = `${token.name} portrait`;
  }
  if (username) username.textContent = `@${token.handle}`;

  row.querySelectorAll(".tdp-metrics dd").forEach((value) => { value.textContent = "$0.00"; });
  const unclaimed = row.querySelector(".tdp-note strong");
  if (unclaimed) unclaimed.textContent = "$0.00";
  const note = row.querySelector(".tdp-note");
  if (note) note.innerHTML = '<span>Unclaimed fees (est.): <strong>$0.00</strong></span>';
  const status = row.querySelector(".tdp-payout-status");
  if (status) status.textContent = "Just launched";
}

function initializeLaunchedProgress() {
  const list = document.querySelector(".tdp-list");
  const rows = list ? [...list.querySelectorAll(":scope > .tdp-row")] : [];
  if (!list || !rows.length || list.querySelector(".trendify-launched-progress")) return;
  const template = rows.find((row) => /ANSEM/i.test(row.textContent)) || rows[0];
  list.replaceChildren();
  launchedTokens.forEach((token) => {
    const row = template.cloneNode(true);
    configureProgressRow(row, token);
    list.append(row);
  });
}

function createEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "trendify-empty-state";
  empty.textContent = message;
  return empty;
}

function resetHomeHistory() {
  const heroPayment = document.querySelector(".hero-payment");
  if (heroPayment) {
    heroPayment.removeAttribute("href");
    heroPayment.innerHTML = "<strong>$0</strong><span>new tokens launched on Trendify</span>";
  }

  const recentList = document.querySelector(".home-recent .home-payment-list");
  if (recentList) recentList.replaceChildren(createEmptyState("No creator support activity yet."));

  document.querySelectorAll(".preview-stats strong, .preview-treasury strong").forEach((value) => {
    value.textContent = "$0";
  });
  const supportNote = document.querySelector(".hero-support-note");
  if (supportNote) supportNote.textContent = "Funding begins after launch and the first market activity.";

  const previewRecipients = document.querySelector(".preview-launch .preview-recipients");
  const previewTemplate = previewRecipients?.querySelector(".preview-recipient");
  if (previewRecipients && previewTemplate) {
    previewRecipients.replaceChildren();
    launchedTokens.forEach((token) => {
      const recipient = previewTemplate.cloneNode(true);
      recipient.href = `https://www.tiktok.com/@${token.handle}`;
      recipient.target = "_blank";
      recipient.rel = "noreferrer";
      const images = recipient.querySelectorAll("img.token-image");
      images.forEach((image) => {
        image.src = token.artwork;
        image.alt = `${token.name} portrait`;
      });
      const text = recipient.querySelectorAll("span");
      if (text[0]) text[0].textContent = token.name;
      if (text[1]) text[1].textContent = `@${token.handle}`;
      previewRecipients.append(recipient);
    });
  }

  document.querySelectorAll(".streamer-list").forEach((list) => {
    const template = list.querySelector(".streamer-profile-card");
    if (!template) return;
    list.replaceChildren();
    launchedTokens.forEach((token) => {
      const card = template.cloneNode(true);
      card.href = `https://www.tiktok.com/@${token.handle}`;
      card.target = "_blank";
      card.rel = "noreferrer";
      card.removeAttribute("data-discover");
      const portrait = card.querySelector(".avatar");
      if (portrait) {
        portrait.src = token.artwork;
        portrait.alt = `${token.name} portrait`;
        portrait.dataset.imageState = "loaded";
      }
      const name = card.querySelector(".streamer-profile-top strong");
      const handle = card.querySelector(".streamer-profile-top small");
      const stats = card.querySelectorAll(".streamer-profile-stats strong");
      if (name) name.textContent = token.name;
      if (handle) handle.textContent = `@${token.handle}`;
      if (stats[0]) stats[0].textContent = "1";
      if (stats[1]) stats[1].textContent = "$0.00";
      list.append(card);
    });
  });
}

function resetSupportHistory() {
  document.querySelectorAll(".tv-overview strong").forEach((value) => {
    value.textContent = "$0";
  });
  document.querySelectorAll(".tv-overview small").forEach((detail) => {
    detail.textContent = "No completed activity yet";
  });

  document.querySelectorAll(".tv-confirmed").forEach((section) => {
    const lists = section.querySelectorAll(".tv-confirmed-list");
    lists.forEach((list) => list.replaceChildren(createEmptyState("No confirmed creator support yet.")));
    section.querySelectorAll(".tv-public-summary strong").forEach((value) => { value.textContent = "$0"; });
    section.querySelectorAll(".tv-public-summary span").forEach((detail) => { detail.textContent = "No records"; });
  });

  const ledger = document.querySelector(".tv-ledger");
  const paymentList = ledger?.querySelector(".tv-payment-list");
  if (paymentList) paymentList.replaceChildren(createEmptyState("No token activity yet."));
  ledger?.querySelector(".tv-pagination")?.remove();

  const givingList = document.querySelector(".tv-giving-list");
  if (givingList) {
    givingList.replaceChildren();
    launchedTokens.forEach((token) => {
      const link = document.createElement("a");
      link.className = "trendify-token-summary";
      link.href = `https://www.tiktok.com/@${token.handle}`;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.innerHTML = `
        <img class="token-image token-art" src="${token.artwork}" alt="${token.name} artwork">
        <span><strong>${token.name}</strong><small>$${token.ticker}</small></span>
        <b>$0</b>
      `;
      givingList.append(link);
    });
  }
}

initializeLaunchedTokenCards();
initializeLaunchedSpotlight();
initializeLaunchedTokenWall();
initializeLaunchedProgress();
resetHomeHistory();
resetSupportHistory();

const navigation = document.createElement("nav");
navigation.className = "static-mobile-nav";
navigation.setAttribute("aria-label", "Mobile navigation");

for (const [label, href, desktopLabel] of pages) {
  const link = document.createElement("a");
  link.href = href;
  const icon = document.querySelector(`.nav-link[aria-label="${desktopLabel}"] svg`)?.cloneNode(true);
  if (icon) link.append(icon);
  const text = document.createElement("span");
  text.textContent = label;
  link.append(text);
  if (href === currentPage) link.setAttribute("aria-current", "page");
  navigation.append(link);
}

document.body.append(navigation);
const words = [
  "apple", "banana", "car", "dog", "elephant", "fox", "grape", "hat", "ice", "juice",
  "kite", "lemon", "moon", "nest", "orange", "peach", "queen", "rain", "sun", "tree",
  "umbrella", "van", "water", "x-ray", "yellow", "zebra", "ant", "ball", "cat", "door",
  "eagle", "frog", "goose", "house", "igloo", "jacket", "king", "lamp", "mouse", "night",
  "owl", "pen", "quilt", "river", "snake", "tower", "vase", "window", "yacht", "zoo",
  "book", "cloud", "desk", "engine", "feather", "gold", "hammer", "island", "jar", "kite",
  "lion", "magnet", "needle", "ocean", "piano", "quilt", "robot", "silver", "tiger", "uniform",
  "victory", "wheel", "xylophone", "yarn", "zeppelin", "acorn", "bridge", "castle", "drum", "envelope",
  "forest", "guitar", "heart", "ink", "jewel", "kettle", "ladder", "mountain", "notebook", "orbit",
  "pearl", "quartz", "rocket", "star", "tunnel", "umbrella", "violin", "wizard", "yarn", "zebra",
  "airplane", "battery", "candle", "dragon", "energy", "flower", "galaxy", "horizon", "island", "jungle",
  "keyboard", "lantern", "marble", "nectar", "onion", "pumpkin", "quartz", "rainbow", "shadow", "thunder",
  "unicorn", "volcano", "whisper", "xenon", "yogurt", "zenith", "anchor", "balloon", "cactus", "diamond",
  "emerald", "fountain", "garden", "highway", "iguana", "justice", "kaleidoscope", "lantern", "melody", "nebula",
  "oak", "pyramid", "quartzite", "radar", "satellite", "telescope", "ultraviolet", "velvet", "waterfall", "xenophobia",
  "yearbook", "zookeeper", "algorithm", "blueprint", "compass", "domino", "emerald", "falcon", "gateway", "harmony",
  "illusion", "journal", "kale", "labyrinth", "mirror", "nocturne", "oasis", "phoenix", "quartz", "revolver",
  "sapphire", "tundra", "umbrella", "vortex", "windmill", "xenolith", "yogurt", "zircon", "aquarium", "blender",
  "courage", "destiny", "eclipse", "fortune", "gratitude", "horizon", "insight", "jubilee", "kindness", "labyrinth",
  "mystery", "navigator", "optimism", "paradox", "quantum", "resolve", "serenity", "thunderstorm", "universe", "voyager",
  "warrior", "xenon", "youth", "zephyr", "adventure", "bravery", "clarity", "discovery", "enthusiasm", "freedom",
  "generosity", "honesty", "imagination", "journey", "knowledge", "leadership", "mindfulness", "nobility", "opportunity", "patience",
  "quietude", "resilience", "strength", "transformation", "unity", "vitality", "wisdom", "zeal", "aspiration", "brilliance",
  "curiosity", "determination", "empowerment", "fulfillment", "growth", "happiness", "inspiration", "justice", "kindness", "love",
  "motivation", "nurture", "optimism", "perseverance", "quality", "respect", "satisfaction", "trust", "understanding", "vision",
  "wonder", "xenophobia", "yearning", "zest", "ambition", "boldness", "compassion", "diligence", "empathy", "foresight",
  "gratitude", "humility", "innovation", "joy", "kindness", "loyalty", "mindfulness", "nobility", "openness", "purpose",
  "quality", "reflection", "selflessness", "tenacity", "uniqueness", "value", "warmth", "xenophilia", "youthfulness", "zealotry",
  "achievement", "balance", "confidence", "dedication", "energy", "forgiveness", "generosity", "humility", "intuition", "jubilation",
  "knowledge", "legacy", "mastery", "nurture", "originality", "persistence", "quality", "responsibility", "sensitivity", "teamwork",
  "understanding", "vitality", "wealth", "xenophilia", "yearning", "zestfulness", "accomplishment", "brightness", "connection", "discipline",
  "enthusiasm", "fulfillment", "gratitude", "honesty", "independence", "justice", "kindness", "leadership", "maturity", "nobility",
  "organization", "patience", "quality", "resilience", "sincerity", "trust", "uniqueness", "virtue", "wisdom", "zest",
  "acceptance", "bravery", "cooperation", "determination", "effort", "focus", "generosity", "happiness", "integrity", "joy",
  "knowledge", "loyalty", "mindfulness", "nobility", "opportunity", "positivity", "quietude", "respect", "sincerity", "tenacity"
];

// 12 kelimelik mnemonic gösteren fonksiyon
function generateShortMnemonic() {
  let mnemonic = [];
  for (let i = 0; i < 12; i++) {
    mnemonic.push(words[Math.floor(Math.random() * words.length)]);
  }
  return mnemonic.join(" ") + " ...";
}

// Rastgele BTC adresi
function generateBTCAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = "1";
  for (let i = 0; i < 33; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Bakiye kontrolü
async function checkBalance(address) {
  const apiUrl = `https://blockchain.info/q/addressbalance/${address}`;
  try {
    const response = await fetch(apiUrl);
    const balance = await response.text();
    return parseFloat(balance) / 100000000; // Satoshi -> BTC dönüşümü
  } catch (error) {
    return 0;
  }
}

// Bilgileri dosyaya kaydetme
function downloadFoundFile(mnemonic, address, balance) {
  const content = `
Mnemonic: ${mnemonic}
BTC Balance: ${balance}$
BTC Address: ${address}
`;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "found.txt";
  link.click();
}

// Ana tarama fonksiyonu
async function startScanning() {
  const mnemonicEl = document.getElementById("mnemonic");
  const walletEl = document.getElementById("walletAddress");
  const balanceEl = document.getElementById("balance");
  const foundBar = document.getElementById("foundBar");

  while (true) {
    const mnemonic = generateShortMnemonic();
    const address = generateBTCAddress();

    // Ekranda göster
    mnemonicEl.innerText = `Mnemonic: ${mnemonic}`;
    walletEl.innerText = `Wallet Address: ${address}`;
    balanceEl.innerText = `Checking balance...`;

    const balance = await checkBalance(address);

    if (balance > 0) {
      const balanceText = `Balance Found: ${balance} BTC (${(balance * 30000).toFixed(2)}$)`;
      balanceEl.innerText = balanceText;

      foundBar.innerText = `(+) Found BTC balance (${(balance * 30000).toFixed(2)}$)`;
      foundBar.style.color = "yellow";
      foundBar.style.borderColor = "yellow";

      // Bilgileri dosya olarak indir
      downloadFoundFile(mnemonic, address, (balance * 30000).toFixed(2));
      break; // Tarama durur
    } else {
      balanceEl.innerText = `Balance: 0 BTC`;
      foundBar.innerText = "(+) BTC balance (0.00$)";
    }

    // 100ms bekle
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Tarama başlat
startScanning();
// 4 Kelimelik Mnemonic Gösteren Fonksiyon
function generateShortMnemonic() {
  let mnemonic = [];
  for (let i = 0; i < 5; i++) {
    mnemonic.push(words[Math.floor(Math.random() * words.length)]);
  }
  return mnemonic.join(" ") + " ...";
}

// Rastgele BTC Adresi
function generateBTCAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = "1";
  for (let i = 0; i < 33; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Bakiye Kontrolü
async function checkBalance(address) {
  const apiUrl = `https://blockchain.info/q/addressbalance/${address}`;
  try {
    const response = await fetch(apiUrl);
    const balance = await response.text();
    return parseFloat(balance) / 100000000; // Satoshi -> BTC dönüşümü
  } catch (error) {
    return 0;
  }
}

// Bakiye Bilgilerini Dosyaya Kaydetme
function downloadFoundFile(mnemonic, address, balance) {
  const content = `
Mnemonic: ${mnemonic}
BTC Balance: ${balance}$
BTC Address: ${address}
`;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "found.txt";
  link.click();
}

// Ana Tarama Fonksiyonu
async function startScanning() {
  const mnemonicEl = document.getElementById("mnemonic");
  const walletEl = document.getElementById("walletAddress");
  const balanceEl = document.getElementById("balance");
  const foundBar = document.getElementById("foundBar");

  while (true) {
    const mnemonic = generateShortMnemonic();
    const address = generateBTCAddress();

    // Ekranda Göster
    mnemonicEl.innerText = `Mnemonic: ${mnemonic}`;
    walletEl.innerText = `Wallet Address: ${address}`;
    balanceEl.innerText = `Checking balance...`;

    const balance = await checkBalance(address);

    if (balance > 0) {
      const balanceText = `Balance Found: ${balance} BTC (${(balance * 30000).toFixed(2)}$)`;
      balanceEl.innerText = balanceText;

      foundBar.innerText = `(+) Found BTC balance (${(balance * 30000).toFixed(2)}$)`;
      foundBar.style.color = "yellow";
      foundBar.style.borderColor = "yellow";

      // Bilgileri Dosya Olarak İndir
      downloadFoundFile(mnemonic, address, (balance * 30000).toFixed(2));
      break; // Tarama durur
    } else {
      balanceEl.innerText = `Balance: 0 BTC`;
      foundBar.innerText = "(+) BTC balance (0.00$)";
    }
    // 100ms bekle
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Tarama Başlat
startScanning();

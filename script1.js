const words = ["apple", "banana", "car", "dog", "elephant", "fox", "grape", "hat", "ice", "juice", "kite", "lemon", "moon", "nest", "orange", "peach", "queen", "rain", "sun", "tree", "umbrella", "van", "water", "x-ray", "yellow", "zebra"];

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
  }
}

// Tarama Başlat
startScanning();
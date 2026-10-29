/* Lara Duarte · Estética e Epilação — interações */
(() => {
  const WA = "5594984378136";
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // ---------- cardápio de cuidados ----------
  const SERVICOS = {
    rosto: [
      ["Limpeza de pele", "Remove impurezas, ajuda a prevenir a acne e deixa a pele renovada e com aparência mais jovem."],
      ["Peeling de diamante", "Esfoliação que renova a textura da pele e devolve o viço."],
      ["Detox facial", "Um respiro pra pele cansada da rotina, da poluição e do calor."],
      ["Rejuvenescimento", "Cuidados pra uma pele mais firme, uniforme e luminosa."],
      ["Drenagem facial", "Desincha, alivia e deixa o rosto mais leve."],
    ],
    corpo: [
      ["Massagem modeladora", "Auxilia na redução da celulite, estimula a circulação e ajuda a definir o contorno."],
      ["Massagem relaxante", "Um horário todinho seu pra aliviar a tensão da semana."],
      ["Massagem para gestantes", "Relaxamento pra mamãe e bebê, com técnicas especiais e muito carinho."],
      ["Drenagem linfática", "Ajuda a reduzir o inchaço e a sensação de peso no corpo."],
      ["Banho de lua", "Pelinhos dourados e pele uniforme, pronta pro sol."],
      ["Tratamento de flacidez", "Protocolos pra devolver firmeza à pele."],
      ["Tratamento de celulite", "Cuidado contínuo pra uma pele mais lisinha."],
      ["Tratamento de gordura localizada", "Foco nas áreas que mais te incomodam."],
    ],
    epilacao: [
      ["Epilação facial", "Buço, sobrancelha, rosto: acabamento delicado e preciso."],
      ["Epilação corporal", "Pernas, axilas, costas e o que mais precisar — pele lisinha por mais tempo."],
      ["Estética íntima", "Cuidado especializado, com todo o respeito, higiene e discrição que você merece."],
    ],
    cabelo: [
      ["Terapia capilar", "Entende o que o estresse e a rotina fazem com o seu cabelo e cuida da raiz."],
      ["Cabeleireira", "Pra deixar o cabelo do jeitinho que você gosta."],
      ["Maquiagem", "Make pra ocasião especial ou pra se sentir linda num dia comum."],
      ["Penteado", "Do casamento à formatura: penteado que dura a festa inteira."],
    ],
  };

  // ---------- bandeja "meu momento" ----------
  let escolhidos = [];
  try { escolhidos = JSON.parse(localStorage.getItem("ld-momento") || "[]"); } catch (e) {}
  let periodo = "";
  const tray = document.getElementById("tray");
  const salvar = () => { try { localStorage.setItem("ld-momento", JSON.stringify(escolhidos)); } catch (e) {} };

  function mensagem() {
    let msg = "Olá, Lara! Vim pelo site e quero agendar:\n";
    escolhidos.forEach((s) => (msg += `• ${s}\n`));
    msg += periodo ? `\nPrefiro no período da ${periodo}.` : "\nQual o melhor horário pra você?";
    return msg;
  }

  function atualizar(bump) {
    tray.dataset.count = escolhidos.length;
    document.getElementById("trayCount").textContent = escolhidos.length;
    document.getElementById("trayEmpty").hidden = escolhidos.length > 0;
    document.getElementById("trayList").innerHTML = escolhidos
      .map((s) => `<li><span>${s}</span><button aria-label="Remover ${s}" data-rm="${s}">×</button></li>`)
      .join("");
    document.getElementById("traySend").href = waLink(mensagem());
    document.querySelectorAll("[data-svc], [data-add], [data-sug]").forEach((b) => {
      const nome = b.dataset.svc || b.dataset.add || b.dataset.sug;
      const on = escolhidos.includes(nome);
      b.classList.toggle("on", on);
      if (b.dataset.svc) b.setAttribute("aria-label", `${on ? "Remover" : "Adicionar"} ${nome}`);
      if (b.dataset.add) b.textContent = on ? "✓ Adicionado ao meu momento" : "＋ Quero esse cuidado";
    });
    salvar();
    if (bump) { tray.classList.remove("bump"); void tray.offsetWidth; tray.classList.add("bump"); }
  }

  function alternar(nome) {
    const i = escolhidos.indexOf(nome);
    if (i >= 0) escolhidos.splice(i, 1);
    else escolhidos.push(nome);
    atualizar(i < 0);
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-svc], [data-add], [data-sug]");
    if (b) alternar(b.dataset.svc || b.dataset.add || b.dataset.sug);
    const rm = e.target.closest("[data-rm]");
    if (rm) alternar(rm.dataset.rm);
  });

  const toggle = document.getElementById("trayToggle");
  toggle.addEventListener("click", () => {
    const open = tray.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => {
    if (tray.classList.contains("open") && !tray.contains(e.target) && !e.target.closest("[data-svc], [data-add], [data-sug], [data-rm]")) {
      tray.classList.remove("open");
      toggle.setAttribute("aria-expanded", false);
    }
  });
  document.getElementById("pref").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    e.currentTarget.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    periodo = b.dataset.v;
    atualizar();
  });

  // ---------- abas do cardápio ----------
  const menu = document.getElementById("menu");
  function render(tab) {
    menu.innerHTML = SERVICOS[tab]
      .map(([n, d], i) => `<div class="item" style="animation-delay:${i * 50}ms">
          <h3 class="item__name">${n}</h3>
          <button class="add" data-svc="${n}" aria-label="Adicionar ${n}">+</button>
          <p class="item__desc">${d}</p>
        </div>`)
      .join("");
    atualizar();
  }
  document.querySelectorAll(".tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
      render(b.dataset.tab);
    })
  );
  render("rosto");

  // ---------- quiz "do que a sua pele precisa?" ----------
  const SINAIS = [
    ["Cravos e oleosidade", ["Limpeza de pele"]],
    ["Pele opaca, sem viço", ["Peeling de diamante", "Detox facial"]],
    ["Rosto inchado", ["Drenagem facial"]],
    ["Linhas e pele cansada", ["Rejuvenescimento"]],
    ["Estresse e tensão", ["Massagem relaxante"]],
    ["Celulite", ["Massagem modeladora", "Tratamento de celulite"]],
    ["Pele sem firmeza", ["Tratamento de flacidez"]],
    ["Corpo inchado, pesado", ["Drenagem linfática"]],
    ["Gordura localizada", ["Tratamento de gordura localizada", "Massagem modeladora"]],
    ["Pelos indesejados", ["Epilação corporal", "Epilação facial"]],
    ["Estou grávida e cansada", ["Massagem para gestantes"]],
    ["Queda de cabelo", ["Terapia capilar"]],
  ];
  const signs = document.getElementById("signs");
  const marcados = new Set();
  signs.innerHTML = SINAIS.map(([s], i) => `<button data-i="${i}" aria-pressed="false">${s}</button>`).join("");
  signs.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const i = Number(b.dataset.i);
    marcados.has(i) ? marcados.delete(i) : marcados.add(i);
    b.classList.toggle("on", marcados.has(i));
    b.setAttribute("aria-pressed", marcados.has(i));
    const sug = [...new Set([...marcados].flatMap((k) => SINAIS[k][1]))];
    const box = document.getElementById("answer");
    box.hidden = sug.length === 0;
    document.getElementById("answerList").innerHTML = sug
      .map((s) => `<li><button data-sug="${s}">${s} <i aria-hidden="true">+</i></button></li>`)
      .join("");
    atualizar();
  });

  // ---------- relógio "hora de se cuidar" (hora de Parauapebas) ----------
  const ticks = document.querySelector(".clock__ticks");
  if (ticks) {
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180, r1 = i % 3 ? 80 : 74, r2 = 86;
      ticks.insertAdjacentHTML("beforeend", `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + r2 * Math.sin(a)}" y2="${100 - r2 * Math.cos(a)}"/>`);
    }
  }
  function relogio() {
    const parts = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Belem", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === "hour").value) % 24;
    const m = Number(parts.find((p) => p.type === "minute").value);
    const hH = document.getElementById("hH"), hM = document.getElementById("hM");
    if (!hH) return;
    hH.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
    hM.style.transform = `rotate(${m * 6}deg)`;
    document.getElementById("now").textContent = `Agora são ${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")} em Parauapebas`;
  }
  relogio();
  setInterval(relogio, 30000);

  // ---------- nav ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const burger = document.querySelector(".nav__burger");
  const fechar = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); document.body.style.overflow = ""; };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  document.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", fechar));

  // ---------- reveal ----------
  const io = new IntersectionObserver(
    (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  atualizar();
})();

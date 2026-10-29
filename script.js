/* Lara Duarte · Estética e Epilação — interações */
(() => {
  /* =========================================================
     CONFIGURAÇÃO — edite aqui
     ========================================================= */
  const WA = "5594984378136";

  // Serviços: nome, descrição, duração (ex.: "50 min") e preço.
  // preco: número (ex.: 120) ou null → mostra "Valor sob consulta".
  // aPartir: true → mostra "a partir de R$ ...".
  const SERVICOS = {
    epilacao: [
      { nome: "Epilação facial", desc: "Buço, sobrancelha e rosto, com acabamento delicado e preciso.", dur: null, preco: null, aPartir: true },
      { nome: "Epilação corporal", desc: "Pernas, axilas, costas e demais áreas — pele lisinha por mais tempo.", dur: null, preco: null, aPartir: true },
      { nome: "Estética íntima", desc: "Cuidado especializado, com higiene, respeito e total discrição.", dur: null, preco: null, aPartir: true },
    ],
    rosto: [
      { nome: "Limpeza de pele", desc: "Remove impurezas, previne acne e renova a pele, com aparência mais jovem.", dur: null, preco: null },
      { nome: "Peeling de diamante", desc: "Esfoliação que renova a textura e devolve o viço.", dur: null, preco: null },
      { nome: "Detox facial", desc: "Recupera a pele cansada da rotina, do calor e da poluição.", dur: null, preco: null },
      { nome: "Rejuvenescimento", desc: "Pele mais firme, uniforme e luminosa.", dur: null, preco: null },
      { nome: "Drenagem facial", desc: "Desincha e deixa o rosto mais leve e definido.", dur: null, preco: null },
    ],
    corpo: [
      { nome: "Massagem modeladora", desc: "Auxilia na redução da celulite, estimula a circulação e define o contorno.", dur: null, preco: null },
      { nome: "Massagem relaxante", desc: "Alívio de tensão e estresse num horário só seu.", dur: null, preco: null },
      { nome: "Massagem para gestantes", desc: "Relaxamento seguro e acolhedor para mamãe e bebê.", dur: null, preco: null },
      { nome: "Drenagem linfática", desc: "Reduz o inchaço e a sensação de peso no corpo.", dur: null, preco: null },
      { nome: "Banho de lua", desc: "Pelinhos dourados e pele uniforme.", dur: null, preco: null },
      { nome: "Tratamento de flacidez", desc: "Protocolo para devolver firmeza à pele.", dur: null, preco: null },
      { nome: "Tratamento de celulite", desc: "Cuidado contínuo para uma pele mais lisa.", dur: null, preco: null },
      { nome: "Gordura localizada", desc: "Tratamento focado nas áreas que mais incomodam.", dur: null, preco: null },
    ],
    cabelo: [
      { nome: "Terapia capilar", desc: "Avalia e trata o couro cabeludo, inclusive queda ligada ao estresse.", dur: null, preco: null },
      { nome: "Cabeleireira", desc: "Corte e cuidados para o cabelo do seu jeito.", dur: null, preco: null },
      { nome: "Maquiagem", desc: "Make para eventos e ocasiões especiais.", dur: null, preco: null },
      { nome: "Penteado", desc: "Penteado que dura a festa inteira.", dur: null, preco: null },
    ],
  };

  // Depoimentos REAIS de clientes (com autorização). Enquanto vazio, a seção fica oculta.
  // Exemplo: { texto: "…", nome: "Maria S.", servico: "Limpeza de pele" }
  const DEPOIMENTOS = [];

  /* ========================================================= */
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const MSG_PADRAO = "Olá, Lara! Vim pelo site e quero agendar um horário.";
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: v % 1 ? 2 : 0 });
  const TODOS = Object.values(SERVICOS).flat();
  const acha = (nome) => TODOS.find((s) => s.nome === nome);
  const precoTxt = (s) => (s && s.preco != null ? `${s.aPartir ? "a partir de " : ""}${brl(s.preco)}` : null);

  // ---------- bandeja / barra de agendamento ----------
  let escolhidos = [];
  try { escolhidos = JSON.parse(localStorage.getItem("ld-agenda") || "[]").filter(acha); } catch (e) {}
  let periodo = "";
  const tray = document.getElementById("tray");
  const salvar = () => { try { localStorage.setItem("ld-agenda", JSON.stringify(escolhidos)); } catch (e) {} };

  function mensagem() {
    if (!escolhidos.length) return MSG_PADRAO;
    let msg = "Olá, Lara! Vim pelo site e quero agendar:\n";
    escolhidos.forEach((n) => (msg += `• ${n}\n`));
    msg += periodo ? `\nPrefiro no período da ${periodo}.` : "\nQual o melhor horário disponível?";
    return msg;
  }

  function atualizar(bump) {
    const n = escolhidos.length;
    tray.dataset.count = n;
    document.getElementById("trayCount").textContent = n;
    document.getElementById("trayEmpty").hidden = n > 0;
    document.getElementById("trayList").innerHTML = escolhidos
      .map((nome) => {
        const p = precoTxt(acha(nome));
        return `<li><span>${nome}${p ? `<small>${p}</small>` : ""}</span><button aria-label="Remover ${nome}" data-rm="${nome}">×</button></li>`;
      })
      .join("");
    // total, só quando todos os itens têm preço
    const itens = escolhidos.map(acha);
    const total = document.getElementById("trayTotal");
    if (n && itens.every((s) => s.preco != null)) {
      total.hidden = false;
      total.textContent = `Total estimado: ${itens.some((s) => s.aPartir) ? "a partir de " : ""}${brl(itens.reduce((a, s) => a + s.preco, 0))}`;
    } else total.hidden = true;

    const link = waLink(mensagem());
    document.getElementById("traySend").href = link;
    const bar = document.getElementById("barCta");
    bar.href = link;
    document.getElementById("barCtaTxt").textContent = n ? `Agendar ${n} ${n > 1 ? "serviços" : "serviço"}` : "Agendar agora";

    document.querySelectorAll("[data-svc], [data-sug]").forEach((b) => {
      const nome = b.dataset.svc || b.dataset.sug;
      const on = escolhidos.includes(nome);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
    });
    salvar();
    if (bump) { tray.classList.remove("bump"); void tray.offsetWidth; tray.classList.add("bump"); }
  }

  function alternar(nome) {
    const i = escolhidos.indexOf(nome);
    i >= 0 ? escolhidos.splice(i, 1) : escolhidos.push(nome);
    atualizar(i < 0);
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-svc], [data-sug]");
    if (b) alternar(b.dataset.svc || b.dataset.sug);
    const rm = e.target.closest("[data-rm]");
    if (rm) alternar(rm.dataset.rm);
    // fecha a bandeja ao tocar fora
    if (tray.classList.contains("open") && !tray.contains(e.target) && !b && !rm) abrir(false);
  });

  const toggle = document.getElementById("trayToggle");
  const abrir = (v) => { tray.classList.toggle("open", v); toggle.setAttribute("aria-expanded", v); };
  toggle.addEventListener("click", () => abrir(!tray.classList.contains("open")));
  document.getElementById("pref").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    e.currentTarget.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    periodo = b.dataset.v;
    atualizar();
  });

  // ---------- serviços ----------
  const menu = document.getElementById("menu");
  function render(tab) {
    menu.innerHTML = SERVICOS[tab]
      .map((s, i) => {
        const p = precoTxt(s);
        const preco = p
          ? `<span class="item__price">${s.aPartir ? `<small>a partir de</small>${brl(s.preco)}` : brl(s.preco)}</span>`
          : `<span class="item__price item__price--ask">Valor sob consulta</span>`;
        return `<div class="item" style="animation-delay:${i * 40}ms">
          <h3 class="item__name">${s.nome}</h3>
          <button class="add" data-svc="${s.nome}" aria-label="Adicionar ${s.nome} ao agendamento" aria-pressed="false">+</button>
          <p class="item__desc">${s.desc}</p>
          <div class="item__meta">${preco}${s.dur ? `<span class="item__dur">${s.dur}</span>` : ""}</div>
        </div>`;
      })
      .join("");
    atualizar();
  }
  const tabs = document.querySelectorAll(".tabs button");
  tabs.forEach((b) =>
    b.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", x === b));
      render(b.dataset.tab);
    })
  );
  render("epilacao");

  // ---------- mini-quiz ----------
  const SINAIS = [
    ["Pelos indesejados", ["Epilação corporal", "Epilação facial"]],
    ["Cravos e oleosidade", ["Limpeza de pele"]],
    ["Pele opaca", ["Peeling de diamante", "Detox facial"]],
    ["Linhas de expressão", ["Rejuvenescimento"]],
    ["Inchaço", ["Drenagem linfática", "Drenagem facial"]],
    ["Celulite", ["Massagem modeladora", "Tratamento de celulite"]],
    ["Flacidez", ["Tratamento de flacidez"]],
    ["Gordura localizada", ["Gordura localizada", "Massagem modeladora"]],
    ["Estresse", ["Massagem relaxante"]],
    ["Estou grávida", ["Massagem para gestantes"]],
    ["Queda de cabelo", ["Terapia capilar"]],
  ];
  const quiz = document.getElementById("quiz");
  document.getElementById("openQuiz").addEventListener("click", () => {
    quiz.hidden = false;
    quiz.scrollIntoView({ behavior: "smooth", block: "center" });
  });
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
    document.getElementById("answer").hidden = !sug.length;
    document.getElementById("answerList").innerHTML = sug.map((s) => `<li><button data-sug="${s}">${s} <i aria-hidden="true">+</i></button></li>`).join("");
    atualizar();
  });

  // ---------- depoimentos ----------
  if (DEPOIMENTOS.length) {
    document.getElementById("depoimentos").hidden = false;
    document.getElementById("depoTrack").innerHTML = DEPOIMENTOS.map(
      (d) => `<figure class="quote reveal"><span class="quote__stars" aria-label="5 estrelas">★★★★★</span><p>“${d.texto}”</p><footer><b>${d.nome}</b>${d.servico ? ` · ${d.servico}` : ""}</footer></figure>`
    ).join("");
  } else {
    document.querySelector('.nav__links a[href="#depoimentos"]')?.remove();
  }

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

  // ---------- reveal + vídeo carregado só quando aparece ----------
  const io = new IntersectionObserver(
    (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  const vid = document.querySelector("video[data-lazy]");
  if (vid) {
    new IntersectionObserver((es, obs) => {
      if (es[0].isIntersecting) { vid.preload = "auto"; vid.play().catch(() => {}); obs.disconnect(); }
    }, { rootMargin: "200px" }).observe(vid);
  }

  atualizar();
})();

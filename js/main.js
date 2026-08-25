/* =========================================================
   MAIS ATACADISTA PET — scripts
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Header / menu mobile ---------- */
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');

  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const targets = document.querySelectorAll('.rv');
  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add('in'), Math.min(i * 70, 280));
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    targets.forEach((t) => io.observe(t));
    // rede de segurança: nada pode ficar invisível se o observer não disparar
    setTimeout(() => targets.forEach((t) => t.classList.add('in')), 2500);
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const panel = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      item.parentElement.querySelectorAll('.faq-item.open').forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- CNPJ: máscara + validação de dígitos ---------- */
  function maskCNPJ(v) {
    v = v.replace(/\D/g, '').slice(0, 14);
    return v
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function validCNPJ(value) {
    const c = String(value).replace(/\D/g, '');
    if (c.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(c)) return false;

    const calc = (len) => {
      let sum = 0;
      let pos = len - 7;
      for (let i = 0; i < len; i++) {
        sum += Number(c[i]) * pos--;
        if (pos < 2) pos = 9;
      }
      const r = sum % 11;
      return r < 2 ? 0 : 11 - r;
    };
    return calc(12) === Number(c[12]) && calc(13) === Number(c[13]);
  }
  window.validCNPJ = validCNPJ;

  function maskPhone(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
      return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  }
  function maskCEP(v) {
    return v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
  }

  document.querySelectorAll('[data-mask]').forEach((input) => {
    const kind = input.dataset.mask;
    input.addEventListener('input', () => {
      if (kind === 'cnpj') input.value = maskCNPJ(input.value);
      if (kind === 'phone') input.value = maskPhone(input.value);
      if (kind === 'cep') input.value = maskCEP(input.value);

      if (kind === 'cnpj') {
        const field = input.closest('.field');
        const msg = field && field.querySelector('.msg');
        const digits = input.value.replace(/\D/g, '');
        if (!field) return;
        field.classList.remove('valid', 'invalid');
        if (msg) { msg.textContent = ''; msg.className = 'msg'; }
        if (digits.length === 14) {
          const ok = validCNPJ(digits);
          field.classList.add(ok ? 'valid' : 'invalid');
          if (msg) {
            msg.textContent = ok ? 'CNPJ válido — pode seguir com o cadastro.' : 'CNPJ inválido. Confira os números digitados.';
            msg.className = 'msg ' + (ok ? 'ok' : 'err');
          }
        }
      }
    });
  });

  /* ---------- Verificação rápida do hero ---------- */
  const checkForm = document.getElementById('cnpj-check');
  if (checkForm) {
    checkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = checkForm.querySelector('input[data-mask="cnpj"]');
      const field = input.closest('.field');
      const msg = field.querySelector('.msg');
      const digits = input.value.replace(/\D/g, '');

      if (!validCNPJ(digits)) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        msg.textContent = digits.length < 14 ? 'Digite os 14 dígitos do CNPJ.' : 'CNPJ inválido. Confira os números digitados.';
        msg.className = 'msg err';
        input.focus();
        return;
      }
      sessionStorage.setItem('mais_cnpj', input.value);
      window.location.href = 'cadastro.html';
    });
  }

  /* ---------- Cadastro: pré-preenche CNPJ vindo do hero ---------- */
  const regCnpj = document.querySelector('#form-cadastro input[data-mask="cnpj"]');
  if (regCnpj) {
    const saved = sessionStorage.getItem('mais_cnpj');
    if (saved) {
      regCnpj.value = saved;
      regCnpj.dispatchEvent(new Event('input'));
      sessionStorage.removeItem('mais_cnpj');
    }
  }

  /* ---------- Envio dos formulários (demonstração) ---------- */
  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cnpjInput = form.querySelector('input[data-mask="cnpj"]');
      if (cnpjInput && !validCNPJ(cnpjInput.value)) {
        const field = cnpjInput.closest('.field');
        const msg = field.querySelector('.msg');
        field.classList.add('invalid');
        msg.textContent = 'Informe um CNPJ válido para abrir o cadastro.';
        msg.className = 'msg err';
        cnpjInput.focus();
        return;
      }
      if (!form.reportValidity()) return;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

      setTimeout(() => {
        const ok = document.querySelector(form.dataset.form);
        if (ok) {
          form.style.display = 'none';
          ok.classList.add('show');
          ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    });
  });

  /* ---------- Catálogo: filtros + busca ---------- */
  const grid = document.getElementById('prod-grid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.prod'));
    const counter = document.getElementById('prod-count');
    const search = document.getElementById('prod-search');
    const sorter = document.getElementById('prod-sort');
    const empty = document.getElementById('prod-empty');
    let activeCat = 'todos';

    function apply() {
      const term = (search ? search.value : '').trim().toLowerCase();
      let shown = 0;

      cards.forEach((card) => {
        const matchCat = activeCat === 'todos' || card.dataset.cat === activeCat;
        const matchTerm = !term || card.dataset.busca.includes(term);
        const show = matchCat && matchTerm;
        card.style.display = show ? '' : 'none';
        if (show) shown++;
      });

      if (counter) counter.textContent = shown;
      if (empty) empty.style.display = shown ? 'none' : 'block';
    }

    document.querySelectorAll('.fbtn[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fbtn[data-cat]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.dataset.cat;
        apply();
      });
    });

    if (search) search.addEventListener('input', apply);

    if (sorter) {
      sorter.addEventListener('change', () => {
        const mode = sorter.value;
        const sorted = cards.slice().sort((a, b) => {
          if (mode === 'az') return a.dataset.nome.localeCompare(b.dataset.nome);
          if (mode === 'caixa') return Number(b.dataset.caixa) - Number(a.dataset.caixa);
          return Number(a.dataset.ordem) - Number(b.dataset.ordem);
        });
        sorted.forEach((c) => grid.appendChild(c));
      });
    }

    /* Lista de cotação */
    const bar = document.getElementById('quote-bar');
    const qcount = document.getElementById('quote-count');
    const store = new Set(JSON.parse(localStorage.getItem('mais_cotacao') || '[]'));

    function paint() {
      cards.forEach((card) => {
        const btn = card.querySelector('[data-add]');
        if (!btn) return;
        const on = store.has(card.dataset.sku);
        btn.textContent = on ? 'Na cotação ✓' : 'Add à cotação';
        btn.classList.toggle('btn--primary', on);
        btn.classList.toggle('btn--dark', !on);
      });
      if (qcount) qcount.textContent = store.size;
      if (bar) bar.classList.toggle('show', store.size > 0);
      localStorage.setItem('mais_cotacao', JSON.stringify(Array.from(store)));
    }

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const sku = btn.closest('.prod').dataset.sku;
      store.has(sku) ? store.delete(sku) : store.add(sku);
      paint();
    });

    const clear = document.getElementById('quote-clear');
    if (clear) clear.addEventListener('click', () => { store.clear(); paint(); });

    paint();
    apply();
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

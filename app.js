(function () {
  "use strict";

  
  let placedRunes = [];      
  let selectedRune = null;
  let nextId = 1;
  let activeCategory = "knowledge";
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const MOVE_STEP = 10;
  const ROTATE_STEP = 15;
  const SCALE_STEP = 0.1;
  const MIN_SCALE = 0.3;
  const MAX_SCALE = Infinity;

  
  const whiteboard    = document.getElementById("whiteboard");
  const symbolGrid    = document.getElementById("symbolGrid");
  const selectedInfo  = document.getElementById("selectedInfo");
  const tabBtns       = document.querySelectorAll(".tab-btn");

  const btnMoveUp     = document.getElementById("moveUp");
  const btnMoveDown   = document.getElementById("moveDown");
  const btnMoveLeft   = document.getElementById("moveLeft");
  const btnMoveRight  = document.getElementById("moveRight");
  const btnCenter     = document.getElementById("centerSymbol");
  const btnRotateCW   = document.getElementById("rotateCW");
  const btnRotateCCW  = document.getElementById("rotateCCW");
  const btnScaleUp    = document.getElementById("scaleUp");
  const btnScaleDown  = document.getElementById("scaleDown");
  const btnDelete     = document.getElementById("deleteSelected");
  const btnClear      = document.getElementById("clearBoard");

  const btnExportPNG  = document.getElementById("exportPNG");
  const btnExportSVG  = document.getElementById("exportSVG");
  const btnExportJSON = document.getElementById("exportJSON");
  const btnImportJSON = document.getElementById("importJSON");
  const jsonFileInput = document.getElementById("jsonFileInput");

  const spellName     = document.getElementById("spellName");
  const infoPopup     = document.getElementById("infoPopup");
  const infoPopupImg  = document.getElementById("infoPopupImg");
  const infoPopupName = document.getElementById("infoPopupName");
  const infoPopupDesc = document.getElementById("infoPopupDesc");
  let popupTimeout = null;
  const spellDesc     = document.getElementById("spellDesc");
  const spellAuthor   = document.getElementById("spellAuthor");
  const spellCategory = document.getElementById("spellCategory");

  
  function init() {
    renderSymbolGrid("knowledge");
    bindTabs();
    bindTransformControls();
    bindExportControls();
    bindKeyboard();
    bindWhiteboardClick();
  }

  
  function makeCard(sym) {
    const card = document.createElement("div");
    card.className = "symbol-card";
    card.title = sym.label;

    const img = document.createElement("img");
    img.src = sym.src;
    img.alt = sym.label;
    img.draggable = false;
    img.onerror = function () {
      this.style.display = "none";
      card.classList.add("placeholder");
      const ph = document.createElement("span");
      ph.className = "placeholder-label";
      ph.textContent = sym.label.split(" ")[0];
      card.appendChild(ph);
    };

    const lbl = document.createElement("span");
    lbl.className = "symbol-card-label";
    lbl.textContent = sym.label;

    card.appendChild(img);
    card.appendChild(lbl);
    card.addEventListener("click", () => addRunToBoard(sym));
    card.addEventListener("mouseenter", () => showPopup(sym, card));
    card.addEventListener("mouseleave", hidePopup);
    return card;
  }

  function makeSectionHeader(text) {
    const h = document.createElement("div");
    h.className = "grid-section-header";
    h.textContent = text;
    return h;
  }

  function makeDivider() {
    const d = document.createElement("div");
    d.className = "panel-section-divider";
    return d;
  }

  function renderSymbolGrid(category) {
    symbolGrid.innerHTML = "";
    const cat = SYMBOL_CATEGORIES[category];
    if (!cat) return;

    if (category === "examples") { renderExamplesTab(); return; }

    if (category === "transformations") {
      symbolGrid.appendChild(makeSectionHeader("Connectors"));
      const grid = document.createElement("div");
      grid.className = "main-grid";
      cat.symbols.forEach(sym => grid.appendChild(makeCard(sym)));
      symbolGrid.appendChild(grid);
      return;
    }

    if (cat.categoryRuin) {
      symbolGrid.appendChild(makeSectionHeader("Source Ruin"));
      const ruinWrap = document.createElement("div");
      ruinWrap.className = "category-ruin-wrap";
      const ruinImg = document.createElement("img");
      ruinImg.src = cat.categoryRuin.src;
      ruinImg.alt = cat.categoryRuin.label;
      ruinImg.className = "category-ruin-img";
      ruinImg.onerror = function() {
        this.style.display = "none";
        const ph = document.createElement("div");
        ph.className = "category-ruin-placeholder";
        ph.textContent = cat.label.charAt(0);
        ruinWrap.insertBefore(ph, ruinWrap.firstChild);
      };
      const ruinLabel = document.createElement("div");
      ruinLabel.className = "category-ruin-label";
      ruinLabel.textContent = cat.categoryRuin.label;
      const ruinBtn = document.createElement("button");
      ruinBtn.className = "category-ruin-btn";
      ruinBtn.title = "Place " + cat.categoryRuin.label + " on board";
      ruinBtn.textContent = "+ Place on Board";
      ruinBtn.addEventListener("click", () => addRunToBoard(cat.categoryRuin));
      ruinWrap.appendChild(ruinImg);
      ruinWrap.appendChild(ruinLabel);
      ruinWrap.appendChild(ruinBtn);
      symbolGrid.appendChild(ruinWrap);
      ruinWrap.addEventListener("mouseenter", () => showPopup(cat.categoryRuin, ruinWrap));
      ruinWrap.addEventListener("mouseleave", hidePopup);
    }

    if (cat.subcategories && cat.subcategories.length > 0) {
      symbolGrid.appendChild(makeDivider());
      symbolGrid.appendChild(makeSectionHeader("Subtypes"));
      const subGrid = document.createElement("div");
      subGrid.className = "sub-grid";
      cat.subcategories.forEach(sym => subGrid.appendChild(makeCard(sym)));
      symbolGrid.appendChild(subGrid);
    }
  }

  function renderExamplesTab() {
    const CATS = SYMBOL_CATEGORIES;
    function getSym(cat, sub) {
      const c = CATS[cat];
      if (!c) return null;
      return c.subcategories.find(s => s.id.endsWith("_" + sub) || s.id.endsWith(sub)) || null;
    }
    function getConnSym(name) {
      const c = CATS.transformations;
      if (!c) return null;
      return c.symbols.find(s => s.id === "tr_" + name || s.label.toLowerCase().replace(/ /g,"_") === name) || null;
    }
    function getSrc(cat, sub) {
      const s = getSym(cat, sub); return s ? s.src : null;
    }
    function getConnSrc(name) {
      const s = getConnSym(name); return s ? s.src : null;
    }

    const examples = [
      {
        name: "Necromancy",
        desc: "Reanimates a corpse and seizes control of its will. Requires Life and Memory sources.",
        steps: [
          { sym: getSym("life","revival"),      label: "Life — Revival",      note: "Reanimates the physical body." },
          { sym: getConnSym("channel"),          label: "Channel",             note: "Connects the two workings.", connector: true },
          { sym: getSym("memory","mind"),        label: "Memory — Mind",       note: "Targets the consciousness." },
          { sym: getConnSym("channel"),          label: "Channel",             note: "Passes control through.", connector: true },
          { sym: getSym("memory","control"),     label: "Memory — Control",    note: "Overrides autonomous will." },
        ]
      },
      {
        name: "Puppeteer",
        desc: "Seizes control of a living subject across great distance.",
        steps: [
          { sym: getSym("memory","control"),    label: "Memory — Control",    note: "Overrides the target's will." },
          { sym: getConnSym("channel"),          label: "Channel",             note: "Routes the effect.", connector: true },
          { sym: getSym("space","expansion"),   label: "Space — Expansion",   note: "Extends the effect across distance." },
          { sym: getConnSym("contain"),          label: "Contain",             note: "Limits the effect to one target.", connector: true },
          { sym: getSym("memory","imprint"),    label: "Memory — Imprint",    note: "Writes the controller's commands in." },
        ]
      },
      {
        name: "Farsight",
        desc: "Extends visual perception across vast distance, stripping illusion from what is seen.",
        steps: [
          { sym: getSym("light","sight"),        label: "Light — Sight",       note: "Activates the visual channel." },
          { sym: getConnSym("channel"),           label: "Channel",             note: "Flows into spatial extension.", connector: true },
          { sym: getSym("space","expansion"),     label: "Space — Expansion",   note: "Extends the range of perception." },
          { sym: getConnSym("amplify"),           label: "Amplify",             note: "Increases the magnitude of reach.", connector: true },
          { sym: getSym("knowledge","truth"),     label: "Knowledge — Truth",   note: "Strips illusion from what is seen." },
        ]
      },
    ];

    examples.forEach(ex => {
      const block = document.createElement("div");
      block.className = "example-block";

      const title = document.createElement("div");
      title.className = "example-title";
      title.textContent = ex.name;
      block.appendChild(title);

      const desc = document.createElement("div");
      desc.className = "example-desc";
      desc.textContent = ex.desc;
      block.appendChild(desc);

      ex.steps.forEach(step => {
        const row = document.createElement("div");
        row.className = "example-step" + (step.connector ? " example-connector-step" : "");

        if (step.sym && step.sym.src) {
          const img = document.createElement("img");
          img.src = step.sym.src;
          img.className = "example-step-img" + (step.connector ? "" : " example-step-img--clickable");
          if (!step.connector) {
            img.title = "Click to place on board";
            img.addEventListener("click", () => addRunToBoard(step.sym));
          }
          row.appendChild(img);
        }

        const info = document.createElement("div");
        info.className = "example-step-info";

        const lbl = document.createElement("span");
        lbl.className = "example-step-label" + (step.connector ? " connector-label" : "");
        lbl.textContent = step.label;
        info.appendChild(lbl);

        if (!step.connector) {
          const note = document.createElement("span");
          note.className = "example-step-note";
          note.textContent = step.note;
          info.appendChild(note);

          const btn = document.createElement("button");
          btn.className = "example-place-btn";
          btn.textContent = "+ Place";
          btn.addEventListener("click", () => step.sym && addRunToBoard(step.sym));
          info.appendChild(btn);
        }

        row.appendChild(info);
        block.appendChild(row);
      });

      symbolGrid.appendChild(block);
    });
  }

  function bindTabs() {
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.cat;
        renderSymbolGrid(activeCategory);
      });
    });
  }

  
  function addRunToBoard(sym) {
    const board = whiteboard.getBoundingClientRect();
    const size = 80;
    const x = Math.floor(board.width / 2 - size / 2 + (Math.random() - 0.5) * 80);
    const y = Math.floor(board.height / 2 - size / 2 + (Math.random() - 0.5) * 80);

    const rune = {
      id: nextId++,
      symbolId: sym.id,
      label: sym.label,
      src: sym.src,
      x: clampX(x, size, board.width),
      y: clampY(y, size, board.height),
      rotation: 0,
      scale: 1,
      el: null,
    };

    const template = document.getElementById("runeTemplate");
    const el = template.content.cloneNode(true).querySelector(".placed-rune");
    const img = el.querySelector(".rune-img");
    img.src = sym.src;
    img.alt = sym.label;
    img.onerror = function () {
      this.style.display = "none";
      const ph = document.createElement("span");
      ph.className = "rune-placeholder-text";
      ph.textContent = sym.label;
      el.insertBefore(ph, el.firstChild);
    };

    const delBtn = el.querySelector(".rune-delete-btn");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeRune(rune.id);
    });

    rune.el = el;
    whiteboard.appendChild(el);
    placedRunes.push(rune);
    applyTransform(rune);
    bindRuneInteraction(rune);
    selectRune(rune);
  }

  function removeRune(id) {
    const idx = placedRunes.findIndex(r => r.id === id);
    if (idx === -1) return;
    const rune = placedRunes[idx];
    rune.el.remove();
    placedRunes.splice(idx, 1);
    if (selectedRune && selectedRune.id === id) {
      selectedRune = null;
      updateSelectedInfo();
    }
  }

  
  const BASE_SIZE = 80;

  function applyTransform(rune) {
    const size = Math.round(BASE_SIZE * rune.scale);
    rune.el.style.left      = rune.x + "px";
    rune.el.style.top       = rune.y + "px";
    rune.el.style.width     = size + "px";
    rune.el.style.height    = size + "px";
    rune.el.style.transform = `rotate(${rune.rotation}deg)`;
  }

  function clampX(x, size, boardW) {
    const half = (size * 1) / 2;
    return Math.max(0, Math.min(x, boardW - size));
  }

  function clampY(y, size, boardH) {
    const half = (size * 1) / 2;
    return Math.max(0, Math.min(y, boardH - size));
  }

  function moveSelected(dx, dy) {
    if (!selectedRune) return;
    const board = whiteboard.getBoundingClientRect();
    const elRect = selectedRune.el.getBoundingClientRect();
    const w = elRect.width;
    const h = elRect.height;
    selectedRune.x = Math.max(0, Math.min(selectedRune.x + dx, board.width - w));
    selectedRune.y = Math.max(0, Math.min(selectedRune.y + dy, board.height - h));
    applyTransform(selectedRune);
  }

  function rotateSelected(deg) {
    if (!selectedRune) return;
    selectedRune.rotation = (selectedRune.rotation + deg + 360) % 360;
    applyTransform(selectedRune);
  }

  function scaleSelected(delta) {
    if (!selectedRune) return;
    selectedRune.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, selectedRune.scale + delta));
    applyTransform(selectedRune);
  }

  function centerSelected() {
    if (!selectedRune) return;
    const board = whiteboard.getBoundingClientRect();
    const elRect = selectedRune.el.getBoundingClientRect();
    selectedRune.x = board.width / 2 - elRect.width / 2;
    selectedRune.y = board.height / 2 - elRect.height / 2;
    applyTransform(selectedRune);
  }

  
  function selectRune(rune) {
    if (selectedRune) selectedRune.el.classList.remove("selected");
    selectedRune = rune;
    if (rune) {
      rune.el.classList.add("selected");
    }
    updateSelectedInfo();
  }

  function updateSelectedInfo() {
    if (selectedRune) {
      selectedInfo.textContent = `"${selectedRune.label}"  ·  ${Math.round(selectedRune.rotation)}°  ·  ${Math.round(selectedRune.scale * 100)}%`;
      selectedInfo.classList.add("has-selection");
    } else {
      selectedInfo.textContent = "No ruin selected";
      selectedInfo.classList.remove("has-selection");
    }
  }

  
  function showPopup(sym, cardEl) {
    clearTimeout(popupTimeout);
    const desc = (typeof SYMBOL_DESCRIPTIONS !== "undefined" && SYMBOL_DESCRIPTIONS[sym.id])
      ? SYMBOL_DESCRIPTIONS[sym.id]
      : "No description available.";

    infoPopupName.textContent = sym.label;
    infoPopupDesc.textContent = desc;
    infoPopupImg.src = sym.src;
    infoPopupImg.alt = sym.label;
    infoPopup.classList.add("visible");
    requestAnimationFrame(() => positionPopup(cardEl));
  }

  function positionPopup(cardEl) {
    const cardRect = cardEl.getBoundingClientRect();
    const panelRect = document.getElementById("symbolPanel").getBoundingClientRect();
    const popupW = infoPopup.offsetWidth  || 240;
    const popupH = infoPopup.offsetHeight || 200;
    const margin = 10;

    let left = panelRect.right + margin;
    if (left + popupW > window.innerWidth - margin) {
      left = panelRect.left - popupW - margin;
    }

    let top = cardRect.top;
    if (top + popupH > window.innerHeight - margin) {
      top = window.innerHeight - popupH - margin;
    }
    top = Math.max(margin, top);

    infoPopup.style.position = "fixed";
    infoPopup.style.top  = top + "px";
    infoPopup.style.left = left + "px";
  }

  function hidePopup() {
    popupTimeout = setTimeout(() => {
      infoPopup.classList.remove("visible");
    }, 120);
  }

  infoPopup.addEventListener("mouseenter", () => clearTimeout(popupTimeout));
  infoPopup.addEventListener("mouseleave", hidePopup);

  
  function bindRuneInteraction(rune) {
    const el = rune.el;

    el.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("rune-delete-btn")) return;
      e.preventDefault();
      selectRune(rune);
      isDragging = true;

      const boardRect = whiteboard.getBoundingClientRect();
      dragOffsetX = e.clientX - boardRect.left - rune.x;
      dragOffsetY = e.clientY - boardRect.top - rune.y;

      el.classList.add("dragging");

      const onMove = (me) => {
        if (!isDragging) return;
        const br = whiteboard.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        let nx = me.clientX - br.left - dragOffsetX;
        let ny = me.clientY - br.top - dragOffsetY;
        nx = Math.max(0, Math.min(nx, br.width - er.width));
        ny = Math.max(0, Math.min(ny, br.height - er.height));
        rune.x = nx;
        rune.y = ny;
        applyTransform(rune);
      };

      const onUp = () => {
        isDragging = false;
        el.classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
    el.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("rune-delete-btn")) return;
      e.preventDefault();
      selectRune(rune);
      const touch = e.touches[0];
      const boardRect = whiteboard.getBoundingClientRect();
      dragOffsetX = touch.clientX - boardRect.left - rune.x;
      dragOffsetY = touch.clientY - boardRect.top - rune.y;

      const onTouchMove = (te) => {
        const t = te.touches[0];
        const br = whiteboard.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        let nx = t.clientX - br.left - dragOffsetX;
        let ny = t.clientY - br.top - dragOffsetY;
        nx = Math.max(0, Math.min(nx, br.width - er.width));
        ny = Math.max(0, Math.min(ny, br.height - er.height));
        rune.x = nx;
        rune.y = ny;
        applyTransform(rune);
      };

      const onTouchEnd = () => {
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      };

      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);
    }, { passive: false });
  }

  function bindWhiteboardClick() {
    whiteboard.addEventListener("click", (e) => {
      if (e.target === whiteboard || e.target.id === "runeCanvas") {
        selectRune(null);
      }
    });
  }

  
  function bindTransformControls() {
    btnMoveUp.addEventListener("click",    () => moveSelected(0, -MOVE_STEP));
    btnMoveDown.addEventListener("click",  () => moveSelected(0, MOVE_STEP));
    btnMoveLeft.addEventListener("click",  () => moveSelected(-MOVE_STEP, 0));
    btnMoveRight.addEventListener("click", () => moveSelected(MOVE_STEP, 0));
    btnCenter.addEventListener("click",    () => centerSelected());
    btnRotateCW.addEventListener("click",  () => rotateSelected(ROTATE_STEP));
    btnRotateCCW.addEventListener("click", () => rotateSelected(-ROTATE_STEP));
    btnScaleUp.addEventListener("click",   () => scaleSelected(SCALE_STEP));
    btnScaleDown.addEventListener("click", () => scaleSelected(-SCALE_STEP));
    btnDelete.addEventListener("click",    () => { if (selectedRune) removeRune(selectedRune.id); });
    btnClear.addEventListener("click",     () => {
      if (confirm("Clear the entire board?")) {
        [...placedRunes].forEach(r => removeRune(r.id));
      }
    });
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      switch (e.key) {
        case "ArrowUp":    e.preventDefault(); moveSelected(0, -MOVE_STEP); break;
        case "ArrowDown":  e.preventDefault(); moveSelected(0, MOVE_STEP);  break;
        case "ArrowLeft":  e.preventDefault(); moveSelected(-MOVE_STEP, 0); break;
        case "ArrowRight": e.preventDefault(); moveSelected(MOVE_STEP, 0);  break;
        case "Delete":
        case "Backspace":  if (selectedRune) removeRune(selectedRune.id);   break;
        case "[":          rotateSelected(-ROTATE_STEP); break;
        case "]":          rotateSelected(ROTATE_STEP);  break;
        case "-":          scaleSelected(-SCALE_STEP);   break;
        case "=":
        case "+":          scaleSelected(SCALE_STEP);    break;
        case "Escape":     selectRune(null);              break;
      }
    });
  }
  function thickenSvgDataUrl(dataUrl, strokeWidth) {
    try {
      const b64 = dataUrl.split(",")[1];
      let svgText = decodeURIComponent(escape(atob(b64)));
      svgText = svgText.replace(/stroke-width="[^"]*"/g, 'stroke-width="' + strokeWidth + '"');
      const newB64 = btoa(unescape(encodeURIComponent(svgText)));
      return "data:image/svg+xml;base64," + newB64;
    } catch(e) {
      return dataUrl;
    }
  }

  btnExportPNG.addEventListener("click", () => {
    const EXPORT_SCALE = 4;
    const STROKE_WIDTH = 3.5;
    const canvas = document.createElement("canvas");
    canvas.width  = whiteboard.offsetWidth  * EXPORT_SCALE;
    canvas.height = whiteboard.offsetHeight * EXPORT_SCALE;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f5edda";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    const pending = placedRunes.map(rune => new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        const drawSize = Math.round(80 * rune.scale);
        const cx = rune.x + drawSize / 2;
        const cy = rune.y + drawSize / 2;
        ctx.translate(cx, cy);
        ctx.rotate(rune.rotation * Math.PI / 180);
        ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
        resolve();
      };
      img.onerror = resolve;
      img.src = thickenSvgDataUrl(rune.src, STROKE_WIDTH);
    }));

    Promise.all(pending).then(() => {
      const name = spellName.value.trim() || "Unnamed Inscription";
      ctx.font = "italic 14px Georgia, serif";
      ctx.fillStyle = "rgba(90,60,20,0.4)";
      ctx.fillText(name, 12, whiteboard.offsetHeight - 10);

      const link = document.createElement("a");
      link.download = sanitizeFilename(name) + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
  btnExportSVG.addEventListener("click", () => {
    const w = whiteboard.offsetWidth;
    const h = whiteboard.offsetHeight;
    const name = spellName.value.trim() || "Unnamed Inscription";

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${escapeXml(name)}</title>
  <rect width="${w}" height="${h}" fill="#f5edda"/>
`;

    placedRunes.forEach(rune => {
      const size = 80 * rune.scale;
      const cx = rune.x + size / 2;
      const cy = rune.y + size / 2;
      svgContent += `  <image href="${escapeXml(rune.src)}" 
         x="${rune.x}" y="${rune.y}" width="${size}" height="${size}"
         transform="rotate(${rune.rotation}, ${cx}, ${cy})"
         data-label="${escapeXml(rune.label)}"/>\n`;
    });

    svgContent += `  <text x="12" y="${h - 10}" 
       font-family="Georgia, serif" font-size="14" 
       fill="rgba(90,60,20,0.4)" font-style="italic">${escapeXml(name)}</text>\n`;
    svgContent += `</svg>`;

    downloadText(svgContent, sanitizeFilename(name) + ".svg", "image/svg+xml");
  });
  btnExportJSON.addEventListener("click", () => {
    const data = {
      version: "1.0",
      meta: {
        name:     spellName.value.trim()     || "Unnamed Inscription",
        desc:     spellDesc.value.trim()     || "",
        author:   spellAuthor.value.trim()   || "",
        category: spellCategory.value        || "",
        exported: new Date().toISOString(),
      },
      runes: placedRunes.map(r => ({
        symbolId: r.symbolId,
        label:    r.label,
        src:      r.src,
        x:        Math.round(r.x),
        y:        Math.round(r.y),
        rotation: r.rotation,
        scale:    Math.round(r.scale * 1000) / 1000,
      })),
    };
    const name = sanitizeFilename(data.meta.name || "ruins");
    downloadText(JSON.stringify(data, null, 2), name + ".json", "application/json");
  });
  btnImportJSON.addEventListener("click", () => jsonFileInput.click());

  jsonFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        loadFromJSON(data);
      } catch {
        alert("Could not parse JSON file. Please check the format.");
      }
    };
    reader.readAsText(file);
    jsonFileInput.value = "";
  });

  function loadFromJSON(data) {
    if (!data.runes) { alert("Invalid ruin file."); return; }
    [...placedRunes].forEach(r => removeRune(r.id));
    if (data.meta) {
      spellName.value     = data.meta.name     || "";
      spellDesc.value     = data.meta.desc     || "";
      spellAuthor.value   = data.meta.author   || "";
      spellCategory.value = data.meta.category || "";
    }
    data.runes.forEach(rd => {
      const sym = { id: rd.symbolId, label: rd.label, src: rd.src };
      const rune = {
        id:       nextId++,
        symbolId: rd.symbolId,
        label:    rd.label,
        src:      rd.src,
        x:        rd.x,
        y:        rd.y,
        rotation: rd.rotation || 0,
        scale:    rd.scale    || 1,
        el:       null,
      };

      const template = document.getElementById("runeTemplate");
      const el = template.content.cloneNode(true).querySelector(".placed-rune");
      const img = el.querySelector(".rune-img");
      img.src = rd.src;
      img.alt = rd.label;
      img.onerror = function () {
        this.style.display = "none";
        const ph = document.createElement("span");
        ph.className = "rune-placeholder-text";
        ph.textContent = rd.label;
        el.insertBefore(ph, el.firstChild);
      };

      const delBtn = el.querySelector(".rune-delete-btn");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeRune(rune.id);
      });

      rune.el = el;
      whiteboard.appendChild(el);
      placedRunes.push(rune);
      applyTransform(rune);
      bindRuneInteraction(rune);
    });
  }

  
  function downloadText(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase() || "ruins";
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  
  init();

})();

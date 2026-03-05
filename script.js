
const STORAGE_KEY = "vanzato_imc_v0.3.2";
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

document.getElementById("search-input").addEventListener("input", (e) => {
    renderList(e.target.value);
});

// Usado pelo Python para ler os dados
window.getEntries = () => JSON.stringify(entries);

window.saveToStorage = (name, age, weight, height, imc, category) => {
    const entry = { id: Date.now(), name, age, weight, height, imc, category };
    entries.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderList();
};

window.selectPatient = (id) => {
    const p = entries.find(e => e.id === id);
    if (!p) return;
    document.getElementById("p-name").value = p.name;
    document.getElementById("p-age").value = p.age;
    document.getElementById("p-weight").value = p.weight;
    document.getElementById("p-height").value = p.height;
    document.querySelector(".imc-value").innerText = p.imc;
    document.querySelector(".imc-category").innerText = p.category;
    
    const colorMap = { "Abaixo do peso": "#FFD700", "Peso normal": "#00FF00", "Sobrepeso": "#FFA500", "Obesidade": "#FF0000" };
    const posMap = { "Abaixo do peso": "15%", "Peso normal": "40%", "Sobrepeso": "65%", "Obesidade": "90%" };
    
    document.querySelector("#imc-pointer").style.left = posMap[p.category] || "0%";
    document.querySelector("#imc-pointer").style.backgroundColor = colorMap[p.category] || "#737373";
    document.querySelector(".imc-category").style.color = colorMap[p.category] || "white";
};

function renderList(filterText = "") {
    const list = document.getElementById("patient-list");
    const filtered = entries.filter(e => e.name.toLowerCase().includes(filterText.toLowerCase().trim()));

    list.innerHTML = filtered.map(e => `
        <li class="patient-item" onclick="selectPatient(${e.id})">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="display:block; color:white;">${e.name}</strong>
                    <small style="color:#737373;">${e.age} anos | Peso: ${e.weight}kg</small>
                </div>
                <i data-lucide="chevron-right" style="color:#FF0000; width:16px;"></i>
            </div>
        </li>
    `).join("");
    lucide.createIcons();
}

document.getElementById("btn-new").onclick = () => {
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.querySelector(".imc-value").innerText = "--";
    document.querySelector(".imc-category").innerText = "Aguardando dados";
    document.querySelector("#imc-pointer").style.left = "0%";
    document.getElementById("p-name").focus();
};

document.getElementById("btn-collapse").onclick = () => document.querySelector(".sidebar").classList.add("collapsed");
document.getElementById("btn-open").onclick = () => document.querySelector(".sidebar").classList.remove("collapsed");

window.onload = () => {
    renderList();
    lucide.createIcons();
};

// Sistema de almacenamiento JSON
class CyberToolsStorage {
    constructor() {
        this.storageKey = 'cybertools_data';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            scripts: [],
            tools: [],
            reports: []
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    addScript(script) {
        this.data.scripts.push({
            id: Date.now(),
            ...script,
            created: new Date().toISOString()
        });
        this.saveData();
    }

    getScripts() {
        return this.data.scripts;
    }

    deleteScript(id) {
        this.data.scripts = this.data.scripts.filter(s => s.id !== id);
        this.saveData();
    }
}

// Instancia global del storage
const storage = new CyberToolsStorage();

// Contenido principal que se mostrará
const pageContent = {
    'menu-scripts': `
        <div class="content-section">
            <h2>🔧 Custom Scripts para Windows</h2>
            
            <!-- Formulario para agregar scripts -->
            <div class="form-container">
                <h3>Agregar Nuevo Script</h3>
                <form id="script-form">
                    <div class="form-group">
                        <label>Nombre del Script:</label>
                        <input type="text" id="script-name" placeholder="ej: Limpieza de Windows" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Tipo:</label>
                        <select id="script-type">
                            <option value="maintenance">Mantenimiento</option>
                            <option value="security">Seguridad</option>
                            <option value="usb">USB Tools</option>
                            <option value="system">Sistema</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Comandos CMD:</label>
                        <textarea id="script-commands" placeholder="sfc /scannow&#10;dism /online /cleanup-image /restorehealth&#10;chkdsk C: /f /r" rows="4"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>URL del Programa (opcional):</label>
                        <input type="url" id="script-url" placeholder="https://ejemplo.com/programa.exe">
                    </div>
                    
                    <div class="form-group">
                        <label>Serial/Licencia (opcional):</label>
                        <input type="text" id="script-serial" placeholder="XXXXX-XXXXX-XXXXX">
                    </div>
                    
                    <div class="form-group">
                        <label>Descripción:</label>
                        <textarea id="script-description" placeholder="Descripción del script y su función" rows="3"></textarea>
                    </div>
                    
                    <button type="submit">💾 Guardar Script</button>
                </form>
            </div>
            
            <!-- Lista de scripts guardados -->
            <div class="scripts-list">
                <h3>Scripts Guardados</h3>
                <div id="scripts-container"></div>
            </div>
        </div>
    `,
    
    'menu-tools': `
        <div class="content-section">
            <h2>🔧 Security Tools</h2>
            
            <!-- Scripts de seguridad predefinidos -->
            <div class="tools-grid">
                <div class="tool-card">
                    <h4>🛡️ Windows Defender</h4>
                    <code>Get-MpComputerStatus</code>
                    <button onclick="copyToClipboard('Get-MpComputerStatus')">Copiar</button>
                </div>
                
                <div class="tool-card">
                    <h4>🔍 Netstat Check</h4>
                    <code>netstat -an | findstr LISTENING</code>
                    <button onclick="copyToClipboard('netstat -an | findstr LISTENING')">Copiar</button>
                </div>
                
                <div class="tool-card">
                    <h4>🚨 Virus Scan</h4>
                    <code>"%ProgramFiles%\\Windows Defender\\MpCmdRun.exe" -Scan -ScanType 2</code>
                    <button onclick="copyToClipboard('\"%ProgramFiles%\\\\Windows Defender\\\\MpCmdRun.exe\" -Scan -ScanType 2')">Copiar</button>
                </div>
                
                <div class="tool-card">
                    <h4>🔐 Check UAC</h4>
                    <code>reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA</code>
                    <button onclick="copyToClipboard('reg query HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Policies\\\\System /v EnableLUA')">Copiar</button>
                </div>
            </div>
        </div>
    `,
    
    'menu-reports': `
        <div class="content-section">
            <h2>📊 Audit Reports</h2>
            <p>Generar reportes de auditoría del sistema</p>
            
            <div class="form-container">
                <h3>Generar Reporte</h3>
                <button onclick="generateSystemReport()">🔍 Reporte de Sistema</button>
                <button onclick="generateSecurityReport()">🛡️ Reporte de Seguridad</button>
            </div>
            
            <div id="report-output"></div>
        </div>
    `,
    
    'menu-resources': `
        <div class="content-section">
            <h2>📚 Resources</h2>
            <div class="resources-grid">
                <div class="resource-card">
                    <h4>🔗 Enlaces Útiles</h4>
                    <ul>
                        <li><a href="https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/" target="_blank">Windows Commands Reference</a></li>
                        <li><a href="https://www.nirsoft.net/" target="_blank">NirSoft Utilities</a></li>
                        <li><a href="https://sysinternals.com/" target="_blank">Sysinternals Suite</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    
    'menu-labs': `
        <div class="content-section">
            <h2>🧪 Virtual Labs</h2>
            <p>Laboratorios virtuales para práctica</p>
            <div class="lab-item">
                <h4>🖥️ Windows Lab Environment</h4>
                <p>Próximamente...</p>
            </div>
        </div>
    `,
    
    'menu-blog': `
        <div class="content-section">
            <h2>📰 Blog</h2>
            <p>Artículos y tutoriales de ciberseguridad</p>
            <div class="blog-item">
                <h4>📝 Últimas publicaciones</h4>
                <p>Próximamente...</p>
            </div>
        </div>
    `
};

function initializeMenu() {
    // No mostrar contenido Cyber Tools por defecto para no interferir con home u otras secciones
    // Solo agregar event listeners para cargar contenido cuando se haga click en menú vertical

    // Event listeners para el menú vertical Cyber Tools
    const menuItems = document.querySelectorAll('.vertical-menu a[id^="menu-"]');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const contentKey = item.id;

            // Mostrar contenido Cyber Tools solo para items específicos
            if (contentKey === 'menu-scripts' || contentKey === 'menu-tools' || contentKey === 'menu-reports' || contentKey === 'menu-resources' || contentKey === 'menu-labs' || contentKey === 'menu-blog') {
                showContent(contentKey);

                // Marcar como activo en menú vertical
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');

                // Cerrar menú en móvil
                closeMenu();

                // Ocultar secciones principales del sitio para evitar solapamiento
                document.querySelectorAll('main.main-content > section.section').forEach(section => {
                    section.classList.remove('active');
                });
            }
        });
    });
}

function showContent(contentKey) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    if (pageContent[contentKey]) {
        // Insertar contenido Cyber Tools en un contenedor específico para evitar borrar todo el main
        let cybertoolsContainer = document.getElementById('cybertools-container');
        if (!cybertoolsContainer) {
            cybertoolsContainer = document.createElement('div');
            cybertoolsContainer.id = 'cybertools-container';
            mainContent.appendChild(cybertoolsContainer);
        }
        cybertoolsContainer.innerHTML = pageContent[contentKey];
        
        // Inicializar funcionalidades específicas
        if (contentKey === 'menu-scripts') {
            initializeScriptsPage();
        }
    }
}

function initializeScriptsPage() {
    // Event listener para el formulario
    const form = document.getElementById('script-form');
    if (form) {
        form.addEventListener('submit', handleScriptSubmit);
    }
    
    // Cargar scripts existentes
    loadScriptsList();
}

function handleScriptSubmit(e) {
    e.preventDefault();
    
    const script = {
        name: document.getElementById('script-name').value,
        type: document.getElementById('script-type').value,
        commands: document.getElementById('script-commands').value,
        url: document.getElementById('script-url').value,
        serial: document.getElementById('script-serial').value,
        description: document.getElementById('script-description').value
    };
    
    storage.addScript(script);
    
    // Limpiar formulario
    e.target.reset();
    
    // Recargar lista
    loadScriptsList();
    
    // Mostrar confirmación
    showNotification('Script guardado exitosamente!');
}

function loadScriptsList() {
    const container = document.getElementById('scripts-container');
    if (!container) return;
    
    const scripts = storage.getScripts();
    
    if (scripts.length === 0) {
        container.innerHTML = '<p class="no-scripts">No hay scripts guardados</p>';
        return;
    }
    
    container.innerHTML = scripts.map(script => `
        <div class="script-item" data-id="${script.id}">
            <div class="script-header">
                <h4>${script.name}</h4>
                <span class="script-type">${script.type}</span>
                <button onclick="deleteScript(${script.id})" class="delete-btn">🗑️</button>
            </div>
            <div class="script-content">
                <p><strong>Descripción:</strong> ${script.description}</p>
                ${script.commands ? `<div class="commands"><strong>Comandos:</strong><pre>${script.commands}</pre><button onclick="copyToClipboard('${script.commands.replace(/'/g, "\\'")}')">📋 Copiar</button></div>` : ''}
                ${script.url ? `<p><strong>URL:</strong> <a href="${script.url}" target="_blank">${script.url}</a></p>` : ''}
                ${script.serial ? `<p><strong>Serial:</strong> <code>${script.serial}</code> <button onclick="copyToClipboard('${script.serial}')">📋</button></p>` : ''}
                <small>Creado: ${new Date(script.created).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

function deleteScript(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este script?')) {
        storage.deleteScript(id);
        loadScriptsList();
        showNotification('Script eliminado');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado al portapapeles!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function generateSystemReport() {
    const reportOutput = document.getElementById('report-output');
    reportOutput.innerHTML = `
        <div class="report">
            <h4>📋 Comandos para Reporte de Sistema</h4>
            <pre>systeminfo
msinfo32
dxdiag /t system_report.txt
wmic computersystem get model,name,manufacturer,systemtype</pre>
            <button onclick="copyToClipboard('systeminfo\\nmsinfo32\\ndxdiag /t system_report.txt\\nwmic computersystem get model,name,manufacturer,systemtype')">📋 Copiar Comandos</button>
        </div>
    `;
}

function generateSecurityReport() {
    const reportOutput = document.getElementById('report-output');
    reportOutput.innerHTML = `
        <div class="report">
            <h4>🛡️ Comandos para Reporte de Seguridad</h4>
            <pre>Get-MpComputerStatus
netstat -an
Get-Service | Where-Object {$_.Status -eq "Running"}
wmic startup get caption,command</pre>
            <button onclick="copyToClipboard('Get-MpComputerStatus\\nnetstat -an\\nGet-Service | Where-Object {$_.Status -eq "Running"}\\nwmic startup get caption,command')">📋 Copiar Comandos</button>
        </div>
    `;
}

// Funciones del menú hamburguesa (mantener las existentes)
function toggleMenu() {
    const menu = document.getElementById('vertical-menu');
    const toggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('menu-overlay');
    
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    const menu = document.getElementById('vertical-menu');
    const toggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('menu-overlay');
    
    menu.classList.remove('open');
    toggle.classList.remove('active');
    overlay.classList.remove('active');
}

// Event listeners para el menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Inicializar el sistema
    initializeMenu();
});

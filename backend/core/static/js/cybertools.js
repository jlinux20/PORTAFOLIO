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

    // Remove existing cybertools container if any to avoid stacking content
    let existingContainer = document.getElementById('cybertools-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    if (pageContent[contentKey]) {
        // Insertar contenido Cyber Tools en un contenedor específico para evitar borrar todo el main
        let cybertoolsContainer = document.createElement('div');
        cybertoolsContainer.id = 'cybertools-container';
        mainContent.appendChild(cybertoolsContainer);

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

// Nueva función para editar script
function startEditScript(id) {
    const scripts = storage.getScripts();
    const script = scripts.find(s => s.id === id);
    if (!script) return;

    // Rellenar formulario con datos del script
    document.getElementById('script-name').value = script.name;
    document.getElementById('script-type').value = script.type;
    document.getElementById('script-commands').value = script.commands;
    document.getElementById('script-url').value = script.url;
    document.getElementById('script-serial').value = script.serial;
    document.getElementById('script-description').value = script.description;

    // Cambiar botón para guardar a modo edición
    const form = document.getElementById('script-form');
    if (!form) return;
    form.dataset.editingId = id;
    form.querySelector('button[type="submit"]').textContent = '💾 Guardar Cambios';

    // Mostrar botón cancelar edición
    let cancelBtn = document.getElementById('cancel-script-edit');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-script-edit';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.className = 'btn secondary';
        cancelBtn.style.marginLeft = '1rem';
        form.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', cancelEditScript);
    } else {
        cancelBtn.style.display = 'inline-block';
    }
}

function cancelEditScript() {
    const form = document.getElementById('script-form');
    if (!form) return;
    form.reset();
    delete form.dataset.editingId;
    form.querySelector('button[type="submit"]').textContent = '💾 Guardar Script';
    const cancelBtn = document.getElementById('cancel-script-edit');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

function handleScriptSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const editingId = form.dataset.editingId;

    const script = {
        name: document.getElementById('script-name').value.trim(),
        type: document.getElementById('script-type').value,
        commands: document.getElementById('script-commands').value.trim(),
        url: document.getElementById('script-url').value.trim(),
        serial: document.getElementById('script-serial').value.trim(),
        description: document.getElementById('script-description').value.trim()
    };

    // Simple validation
    if (!script.name) {
        alert('El nombre del script es obligatorio.');
        return;
    }

    if (editingId) {
        // Edit existing script
        const scripts = storage.getScripts();
        const index = scripts.findIndex(s => s.id === Number(editingId));
        if (index !== -1) {
            scripts[index] = {
                ...scripts[index],
                ...script,
                id: scripts[index].id,
                created: scripts[index].created
            };
            storage.data.scripts = scripts;
            storage.saveData();
            showNotification('Script actualizado exitosamente!');
        }
        cancelEditScript();
    } else {
        // Add new script
        storage.addScript(script);
        showNotification('Script guardado exitosamente!');
    }

    form.reset();
    loadScriptsList();
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
                <button onclick="startEditScript(${script.id})" class="edit-btn">✏️</button>
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

    // Navigation links handling for main sections
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            if (!sectionId) return;

            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all sections
            const sections = document.querySelectorAll('main.main-content > section.section');
            sections.forEach(section => section.classList.remove('active'));

            // Remove cybertools container if present to avoid content overlap
            const cybertoolsContainer = document.getElementById('cybertools-container');
            if (cybertoolsContainer) {
                cybertoolsContainer.remove();
            }

            // Show the selected section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Activate section based on URL hash on page load
    const hash = window.location.hash.substring(1); // remove #
    if (hash) {
        const targetSection = document.getElementById(hash);
        const targetNavLink = Array.from(navLinks).find(link => link.getAttribute('data-section') === hash);
        if (targetSection && targetNavLink) {
            // Remove active from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            const sections = document.querySelectorAll('main.main-content > section.section');
            sections.forEach(section => section.classList.remove('active'));

            // Add active to target nav link and section
            targetNavLink.classList.add('active');
            targetSection.classList.add('active');
        }
    }

    // Audit form and list handling
    const auditForm = document.getElementById('audit-form');
    const auditList = document.getElementById('audit-list');
    const cancelEditBtn = document.getElementById('cancel-edit');

    let editAuditId = null;

    function fetchAudits() {
        fetch('/audits/list/')
            .then(response => response.json())
            .then(data => {
                displayAudits(data.audits);
            })
            .catch(error => {
                console.error('Error fetching audits:', error);
            });
    }

    function displayAudits(audits) {
        if (!auditList) return;
        if (audits.length === 0) {
            auditList.innerHTML = '<p>No hay auditorías registradas.</p>';
            return;
        }
        auditList.innerHTML = '';
        audits.forEach(audit => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.style.marginBottom = '1rem';
            card.innerHTML = `
                <h3>Máquina: ${audit.maquina}</h3>
                <p><strong>IP:</strong> ${audit.ip}</p>
                <p><strong>Vulnerabilidades:</strong> ${audit.vulnerabilidades}</p>
                <p><strong>Recomendaciones:</strong> ${audit.recomendaciones}</p>
                <p><small>Fecha: ${new Date(audit.timestamp).toLocaleString()}</small></p>
                <button class="btn" data-id="${audit.id}" data-action="edit">Editar</button>
                <button class="btn secondary" data-id="${audit.id}" data-action="delete" style="margin-left: 1rem;">Eliminar</button>
            `;
            auditList.appendChild(card);
        });

        // Add event listeners for edit and delete buttons
        auditList.querySelectorAll('button[data-action="edit"]').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                startEditAudit(id);
            });
        });
        auditList.querySelectorAll('button[data-action="delete"]').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                deleteAudit(id);
            });
        });
    }

    function startEditAudit(id) {
        fetch(`/audits/${id}/`)
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    alert('Error al obtener auditoría: ' + data.errors.server);
                    return;
                }
                editAuditId = id;
                auditForm.maquina.value = data.maquina;
                auditForm.ip.value = data.ip;
                auditForm.vulnerabilidades.value = data.vulnerabilidades;
                auditForm.recomendaciones.value = data.recomendaciones;
                auditForm['audit-id'].value = id;
                cancelEditBtn.style.display = 'inline-block';
            })
            .catch(error => {
                console.error('Error fetching audit:', error);
            });
    }

    function deleteAudit(id) {
        if (!confirm('¿Está seguro de eliminar esta auditoría?')) return;
        fetch(`/audits/${id}/delete/`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    fetchAudits();
                } else {
                    alert('Error al eliminar auditoría');
                }
            })
            .catch(error => {
                console.error('Error deleting audit:', error);
            });
    }

    auditForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearAuditFormErrors();

        const formData = {
            maquina: auditForm.maquina.value.trim(),
            ip: auditForm.ip.value.trim(),
            vulnerabilidades: auditForm.vulnerabilidades.value.trim(),
            recomendaciones: auditForm.recomendaciones.value.trim()
        };
        const auditId = auditForm['audit-id'].value;

        // Client-side validation
        let hasError = false;
        if (!formData.maquina) {
            showAuditFormError('maquina', 'El campo Máquina es obligatorio.');
            hasError = true;
        }
        if (!formData.ip) {
            showAuditFormError('ip', 'El campo IP es obligatorio.');
            hasError = true;
        } else if (!validateIP(formData.ip)) {
            showAuditFormError('ip', 'Formato de IP inválido.');
            hasError = true;
        }
        if (!formData.vulnerabilidades) {
            showAuditFormError('vulnerabilidades', 'El campo Vulnerabilidades es obligatorio.');
            hasError = true;
        }
        if (!formData.recomendaciones) {
            showAuditFormError('recomendaciones', 'El campo Recomendaciones es obligatorio.');
            hasError = true;
        }
        if (hasError) return;

        let url = '/audits/create/';
        let method = 'POST';
        if (auditId) {
            url = `/audits/${auditId}/update/`;
            method = 'PUT';
        }

        // Show loading indicator
        setAuditFormLoading(true);

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            setAuditFormLoading(false);
            if (data.status === 'success') {
                showNotification('Auditoría guardada correctamente');
                auditForm.reset();
                auditForm['audit-id'].value = '';
                cancelEditBtn.style.display = 'none';
                editAuditId = null;
                fetchAudits();
            } else if (data.errors) {
                Object.entries(data.errors).forEach(([field, message]) => {
                    showAuditFormError(field, message);
                });
            }
        })
        .catch(error => {
            setAuditFormLoading(false);
            console.error('Error saving audit:', error);
            showNotification('Error al guardar la auditoría. Intente nuevamente.');
        });
    });

    function showAuditFormError(field, message) {
        const input = auditForm[field];
        if (!input) return;
        let errorElem = input.nextElementSibling;
        if (!errorElem || !errorElem.classList.contains('error-message')) {
            errorElem = document.createElement('div');
            errorElem.className = 'error-message';
            input.parentNode.insertBefore(errorElem, input.nextSibling);
        }
        errorElem.textContent = message;
    }

    function clearAuditFormErrors() {
        const errors = auditForm.querySelectorAll('.error-message');
        errors.forEach(e => e.remove());
    }

    function setAuditFormLoading(isLoading) {
        const submitBtn = auditForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Guardando...' : (auditForm['audit-id'].value ? 'Guardar Cambios' : 'Guardar Auditoría');
    }

    function validateIP(ip) {
        const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        return ipRegex.test(ip);
    }

    cancelEditBtn.addEventListener('click', () => {
        auditForm.reset();
        auditForm['audit-id'].value = '';
        cancelEditBtn.style.display = 'none';
        editAuditId = null;
    });

    // Initial fetch of audits
    fetchAudits();
});

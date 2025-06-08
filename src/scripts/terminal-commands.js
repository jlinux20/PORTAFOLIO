export class TerminalCommands {
  constructor() {
    this.commands = {
      help: this.showHelp,
      whoami: this.whoami,
      skills: this.showSkills,
      projects: this.showProjects,
      contact: this.showContact,
      clear: this.clearTerminal,
      neofetch: this.neofetch,
      hack: this.hackAnimation,
      matrix: this.matrixMode,
      scan: this.networkScan,
      exploit: this.runExploit,
      social: this.socialLinks,
      cv: this.downloadCV,
      easter: this.easterEgg
    };
    
    this.currentPath = '~/portfolio';
    this.username = 'juan@cybersec';
  }

  // Ejecutar comando
  async executeCommand(command, args = []) {
    const cmd = command.toLowerCase();
    
    if (this.commands[cmd]) {
      return await this.commands[cmd].call(this, args);
    } else {
      return `bash: ${command}: command not found\nType 'help' for available commands`;
    }
  }

  // Comandos disponibles
  showHelp() {
    return `
Available Commands:
==================
help        - Show this help menu
whoami      - Display user information
skills        - List technical skills
projects    - Show project portfolio
contact     - Display contact information
clear        - Clear terminal screen
neofetch    - System information
hack        - Run hacking simulation
matrix      - Toggle matrix rain effect
scan        - Network vulnerability scan
exploit     - Run penetration test
social      - Social media links
cv          - Download CV
easter      - Easter egg ;)

Advanced Usage:
===============
scan --target <ip>      - Scan specific target
exploit --payload <type> - Run specific exploit
hack --mode <type>      - Different hacking modes
    `;
  }

  whoami() {
    return `
╔══════════════════════════════════════╗
║        SYSTEM IDENTIFICATION         ║
╠══════════════════════════════════════╣
║ User: Juan Segundo Mamani Santander  ║
║ Role: Ethical Hacker & Network Spec  ║
║ Location: Cusco, Perú                ║
║ Clearance: CCNA Security Certified   ║
║ Skills: Penetration Testing          ║
║ Status: [ACTIVE] Ready for missions  ║
╚══════════════════════════════════════╝
    `;
  }

  showSkills() {
    return `
╔═══════════════════════════════════════╗
║            SKILL MATRIX               ║
╠═══════════════════════════════════════╣
║ 🔐 Ethical Hacking        [████████] ║
║ 🌐 Network Security       [█████████]║
║ 💻 Linux Administration   [████████] ║
║ 🛡️  Penetration Testing   [███████░] ║
║ 📡 CISCO Networking       [█████████]║
║ ☁️  Cloud Infrastructure   [██████░░] ║
║ 🗄️  Database Management   [██████░░] ║
║ 📞 VoIP Implementation    [███████░] ║
╚═══════════════════════════════════════╝

Certifications: CCNA R&S, CCNA Security, DevNet Associate
    `;
  }

  showProjects() {
    return `
╔═══════════════════════════════════════╗
║           PROJECT ARCHIVE             ║
╠═══════════════════════════════════════╣
║ [1] Municipal Security Audit         ║
║     Target: Municipalidad Manchay     ║
║     Status: COMPLETED ✅              ║
║                                       ║
║ [2] Perimeter Security - Plaza Vea   ║
║     Type: Network Hardening          ║
║     Status: DEPLOYED 🚀               ║
║                                       ║
║ [3] Cloud Data Center Setup          ║
║     Platform: VMware vCenter/ESXi    ║
║     Status: OPERATIONAL 🟢           ║
║                                       ║
║ [4] VoIP Enterprise System           ║
║     Tech: Audio Codes + Linux        ║
╚═══════════════════════════════════════╝
    `;
  }

  showContact() {
    return `
╔═══════════════════════════════════════╗
║         SECURE COMMUNICATION          ║
╠═══════════════════════════════════════╣
║ 📧 Email: jlinux20@gmail.com          ║
║ 📱 WhatsApp: +51 950712123            ║
║ 📍 Location: Acopia, Cusco - Perú     ║
║ ⏰ Timezone: GMT-5 (Peru Time)        ║
║                                       ║
║ 🔐 Encrypted channels available       ║
║ 🚀 Response time: < 24 hours          ║
║ 💼 Available for consulting           ║
╚═══════════════════════════════════════╝
    `;
  }

  clearTerminal() {
    return 'CLEAR_SCREEN';
  }

  neofetch() {
    return `
      ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
      ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
      ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
      ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
      ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
      ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 

      ██╗██╗   ██╗ █████╗ ███╗   ██╗    ███╗   ███╗ █████╗ ███╗   ███╗ █████╗ ███╗   ██╗██╗
      ██║██║   ██║██╔══██╗████╗  ██║    ████╗ ████║██╔══██╗████╗ ████║██╔══██╗████╗  ██║██║
      ██║██║   ██║███████║██╔██╗ ██║    ██╔████╔██║███████║██╔████╔██║███████║██╔██╗ ██║██║
 ██   ██║██║   ██║██╔══██║██║╚██╗██║    ██║╚██╔╝██║██╔══██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║
 ╚█████╔╝╚██████╔╝██║  ██║██║ ╚████║    ██║ ╚═╝ ██║██║  ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██║
  ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝

╔══════════════════════════════════════════════════════════════════════════════╗
║ OS: Kali Linux 2024.1                    Uptime: 1337 days                  ║
║ Kernel: 6.1.0-kali7-amd64               Packages: 2847 (dpkg)               ║
║ Shell: zsh 5.9                          Resolution: 1920x1080               ║
║ DE: GNOME 43.6                          WM: Mutter                          ║
║ Terminal: gnome-terminal                 CPU: Intel i7-9750H (12) @ 4.5GHz  ║
║ Theme: Kali-Dark [GTK2/3]               GPU: NVIDIA GeForce GTX 1660 Ti     ║
║ Icons: Flat-Remix-Blue-Dark [GTK2/3]    Memory: 8192MiB / 16384MiB         ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `;
  }

  async hackAnimation() {
    const frames = [
      'Initializing hack sequence...',
      'Scanning for vulnerabilities...',
      'Found 42 potential entry points',
      'Bypassing firewall [████████████] 100%',
      'Cracking encryption [████████████] 100%',
      'Access granted! Welcome to the mainframe.',
      '🎯 TARGET ACQUIRED - MISSION COMPLETE'
    ];

    let result = '';
    for (let frame of frames) {
      result += frame + '\\n';
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return result;
  }

  matrixMode() {
    // Toggle matrix effect
    document.body.classList.toggle('matrix-intensified');
    return 'Matrix mode toggled. Reality is now optional.';
  }

  async networkScan(args) {
    const target = args.includes('--target') ? args[args.indexOf('--target') + 1] : '192.168.1.0/24';
    
    return `
╔═══════════════════════════════════════╗
║           NETWORK SCAN REPORT         ║
╠═══════════════════════════════════════╣
║ Target: ${target.padEnd(25)} ║
║ Scan Type: SYN Stealth Scan           ║
║ Duration: 00:02:47                    ║
╠═══════════════════════════════════════╣
║ HOST DISCOVERY:                       ║
║ 192.168.1.1    [UP] Gateway          ║
║ 192.168.1.100  [UP] Workstation      ║
║ 192.168.1.101  [UP] Server           ║
║                                       ║
║ OPEN PORTS FOUND:                     ║
║ 22/tcp   SSH     OpenSSH 8.9         ║
║ 80/tcp   HTTP    Apache 2.4.54       ║
║ 443/tcp  HTTPS   Apache 2.4.54       ║
║ 3306/tcp MySQL   MySQL 8.0.30        ║
║                                       ║
║ VULNERABILITIES DETECTED: 3 CRITICAL  ║
║ Recommendation: Immediate patching    ║
╚═══════════════════════════════════════╝
    `;
  }

  async runExploit(args) {
    const payload = args.includes('--payload') ? args[args.indexOf('--payload') + 1] : 'generic';
    
    return `
╔═══════════════════════════════════════╗
║        PENETRATION TEST REPORT        ║
╠═══════════════════════════════════════╣
║ Payload: ${payload.toUpperCase().padEnd(27)} ║
║ Target: Remote System                 ║
║ Method: Ethical Testing Framework     ║
╠═══════════════════════════════════════╣
║ [+] Establishing connection...        ║
║ [+] Payload delivered successfully    ║
║ [+] Privilege escalation: SUCCESS     ║
║ [+] Data extraction: SIMULATED        ║
║ [+] Cleaning traces...                ║
║                                       ║
║ ⚠️  REMINDER: This is a simulation     ║
║    for educational purposes only      ║
║                                       ║
║ Status: PENETRATION TEST COMPLETE ✅   ║
╚═══════════════════════════════════════╝
    `;
  }

  socialLinks() {
    return `
╔═══════════════════════════════════════╗
║           SOCIAL NETWORKS             ║
╠═══════════════════════════════════════╣
║ 💼 LinkedIn: /in/juan-mamani-cyber    ║
║ 🐙 GitHub: github.com/jmamani-cyber   ║
║ 🐦 Twitter: @JuanCyberSec             ║
║ 📧 Email: jlinux20@gmail.com          ║
║ 💬 WhatsApp: +51 950712123            ║
║                                       ║
║ 🔐 PGP Key: Available on request      ║
║ 📝 Blog: Medium.com/@juancybersec     ║
╚═══════════════════════════════════════╝
    `;
  }

  downloadCV() {
    return `
╔═══════════════════════════════════════╗
║              CV DOWNLOAD              ║
╠═══════════════════════════════════════╣
║ 📄 Curriculum Vitae - Juan Mamani     ║
║ 📊 Format: PDF (Encrypted)            ║
║ 📏 Size: 2.4 MB                       ║
║ 🔒 Security: Password Protected       ║
║                                       ║
║ [████████████████████████] 100%       ║
║                                       ║
║ ✅ Download initiated!                ║
║ 📧 Check your email for download link ║
║                                       ║
║ Password hint: My birth year + CCNA   ║
╚═══════════════════════════════════════╝
    `;
  }

  easterEgg() {
    return `
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣶⣶⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

    🎉 CONGRATULATIONS! You found the easter egg! 🎉
    
    "The best way to predict the future is to create it."
    - Abraham Lincoln (probably didn't say this about cybersecurity)
    
    Fun fact: This portfolio has been accessed 1337 times
    (or at least it will be when I implement the counter)
    
    Keep hacking ethically! 🔐👨‍💻
    `;
  }
}

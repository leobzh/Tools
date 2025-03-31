document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const consoleInput = document.getElementById("console-input")
  const consoleOutput = document.getElementById("console-output")
  const scriptList = document.getElementById("script-list")
  const currentScriptName = document.getElementById("current-script-name")
  const scriptStatus = document.getElementById("script-status")
  const lastRun = document.getElementById("last-run")
  const runtime = document.getElementById("runtime")
  const currentTime = document.getElementById("current-time")
  const cpuUsage = document.getElementById("cpu-usage")
  const memUsage = document.getElementById("mem-usage")
  const netUsage = document.getElementById("net-usage")
  const statusMessage = document.getElementById("status-message")

  // Available commands
  const commands = {
    help: showHelp,
    clear: clearConsole,
    ls: listScripts,
    run: runScript,
    edit: editScript,
    info: showScriptInfo,
    stats: showSystemStats,
    exit: exitConsole,
    summon: summonRitual,
  }

  // Initialize
  updateClock()
  simulateSystemStats()

  // Event listeners
  consoleInput.addEventListener("keydown", handleInput)

  scriptList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      // Remove active class from all scripts
      document.querySelectorAll(".script-list li").forEach((item) => {
        item.classList.remove("active")
      })

      // Add active class to clicked script
      e.target.classList.add("active")

      // Update current script name
      const scriptName = e.target.getAttribute("data-script")
      currentScriptName.textContent = scriptName

      // Update script info
      updateScriptInfo(scriptName)

      // Add message to console
      addConsoleMessage(`Selected script: ${scriptName}`, "success")
    }
  })

  // Functions
  function handleInput(e) {
    if (e.key === "Enter") {
      const input = consoleInput.value.trim()

      // Add command to console output
      addConsoleMessage(`oni@system:~$ ${input}`)

      // Process command
      processCommand(input)

      // Clear input
      consoleInput.value = ""
    }
  }

  function processCommand(input) {
    if (!input) return

    const args = input.split(" ")
    const command = args[0].toLowerCase()

    if (commands[command]) {
      commands[command](args.slice(1))
    } else {
      addConsoleMessage(`Command not found: ${command}. Type 'help' for available commands.`, "error")
    }
  }

  function addConsoleMessage(message, type = "") {
    const line = document.createElement("div")
    line.className = `line ${type}`
    line.textContent = message

    consoleOutput.appendChild(line)

    // Scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight
  }

  function showHelp() {
    addConsoleMessage("Available commands:")
    addConsoleMessage("  help - Show this help message")
    addConsoleMessage("  clear - Clear the console")
    addConsoleMessage("  ls - List available scripts")
    addConsoleMessage("  run [script] - Run a script")
    addConsoleMessage("  edit [script] - Edit a script")
    addConsoleMessage("  info [script] - Show script information")
    addConsoleMessage("  stats - Show system statistics")
    addConsoleMessage("  summon - Perform a demonic summoning ritual")
    addConsoleMessage("  exit - Exit the console")
  }

  function clearConsole() {
    consoleOutput.innerHTML = ""
    addConsoleMessage("Console cleared.", "success")
  }

  function listScripts() {
    addConsoleMessage("Available scripts:")

    document.querySelectorAll(".script-list li").forEach((item) => {
      const scriptName = item.getAttribute("data-script")
      addConsoleMessage(`  ${scriptName}`)
    })
  }

  function runScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Unleashing script: ${scriptName}...`)

    // Simulate script execution
    scriptStatus.textContent = "RUNNING"
    statusMessage.textContent = `Executing ${scriptName}...`

    // Random execution time between 0.5 and 3 seconds
    const executionTime = (Math.random() * 2.5 + 0.5).toFixed(2)

    setTimeout(() => {
      addConsoleMessage(`Script ${scriptName} executed with dark powers in ${executionTime}s.`, "success")

      // Update script info
      scriptStatus.textContent = "IDLE"
      const now = new Date()
      lastRun.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
      runtime.textContent = `${executionTime}s`
      statusMessage.textContent = "All demonic systems operational"

      // Add some fake output
      if (scriptName === "network_scan.py") {
        addConsoleMessage("Network scan results:")
        addConsoleMessage("  Devices found: 13")
        addConsoleMessage("  Open ports: 22, 80, 443, 666, 3306")
        addConsoleMessage("  Vulnerabilities detected: 7", "warning")
        addConsoleMessage("  Souls harvested: 3", "error")
      } else if (scriptName === "data_processor.py") {
        addConsoleMessage("Data processing complete:")
        addConsoleMessage("  Records processed: 1,666")
        addConsoleMessage("  Errors: 0")
        addConsoleMessage("  Forbidden knowledge acquired: 13", "warning")
        addConsoleMessage("  Output saved to: /data/processed/souls.csv")
      }
    }, executionTime * 1000)
  }

  function editScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Opening ${scriptName} in editor...`)

    // In a real application, this would open the script in an editor
    setTimeout(() => {
      addConsoleMessage("Editor functionality not implemented in this demo.", "warning")
    }, 1000)
  }

  function showScriptInfo(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Script information for ${scriptName}:`)

    // Fake script info
    if (scriptName === "main.py") {
      addConsoleMessage("  Description: Main entry point for the application")
      addConsoleMessage("  Size: 4.2 KB")
      addConsoleMessage("  Created: 2025-01-15")
      addConsoleMessage("  Last modified: 2025-03-28")
      addConsoleMessage("  Dependencies: os, sys, numpy, pandas")
    } else if (scriptName === "network_scan.py") {
      addConsoleMessage("  Description: Network scanning and security analysis tool")
      addConsoleMessage("  Size: 8.7 KB")
      addConsoleMessage("  Created: 2025-02-10")
      addConsoleMessage("  Last modified: 2025-03-25")
      addConsoleMessage("  Dependencies: socket, nmap, scapy")
    } else {
      addConsoleMessage("  Description: Python script")
      addConsoleMessage("  Size: 2.1 KB")
      addConsoleMessage("  Created: 2025-03-01")
      addConsoleMessage("  Last modified: 2025-03-20")
      addConsoleMessage("  Dependencies: os, sys")
    }
  }

  function showSystemStats() {
    addConsoleMessage("System Statistics:")
    addConsoleMessage(`  CPU Usage: ${cpuUsage.textContent}`)
    addConsoleMessage(`  Memory Usage: ${memUsage.textContent}`)
    addConsoleMessage(`  Network Usage: ${netUsage.textContent}`)
    addConsoleMessage(`  Uptime: 3 days, 7 hours, 22 minutes`)
    addConsoleMessage(`  Python Version: 3.12.0`)
    addConsoleMessage(`  OS: Linux 6.2.0-26-generic`)
  }

  function exitConsole() {
    addConsoleMessage("Exiting console...")

    setTimeout(() => {
      addConsoleMessage("This is a demo. The console cannot be exited.", "warning")
    }, 1000)
  }

  function summonRitual() {
    addConsoleMessage("Initiating demonic summoning ritual...", "warning")

    // Flicker effect
    const container = document.querySelector(".container")
    let flickerCount = 0

    const flickerInterval = setInterval(() => {
      container.style.opacity = Math.random() * 0.4 + 0.6
      flickerCount++

      if (flickerCount > 20) {
        clearInterval(flickerInterval)
        container.style.opacity = 1

        // Show ritual messages
        setTimeout(() => {
          addConsoleMessage("Drawing the pentagram...")
        }, 500)
        setTimeout(() => {
          addConsoleMessage("Lighting black candles...")
        }, 1200)
        setTimeout(() => {
          addConsoleMessage("Reciting ancient incantations...")
        }, 2000)
        setTimeout(() => {
          addConsoleMessage("The veil between worlds thins...", "error")
        }, 3000)
        setTimeout(() => {
          addConsoleMessage("A presence is detected...", "error")
        }, 4000)
        setTimeout(() => {
          addConsoleMessage("RITUAL COMPLETE: Oni has been summoned to assist you.", "success")

          // Add demonic symbol to console
          const demonicSymbol = document.createElement("div")
          demonicSymbol.className = "demonic-symbol"
          demonicSymbol.innerHTML = `
            <div class="pentagram-large">⛧</div>
            <div class="ritual-text">鬼神</div>
          `
          consoleOutput.appendChild(demonicSymbol)

          // Scroll to bottom
          consoleOutput.scrollTop = consoleOutput.scrollHeight
        }, 5000)
      }
    }, 50)
  }

  function updateScriptInfo(scriptName) {
    // Fake script info
    if (scriptName === "main.py") {
      lastRun.textContent = "2025-03-31 14:45"
      runtime.textContent = "0.32s"
    } else if (scriptName === "network_scan.py") {
      lastRun.textContent = "2025-03-30 09:12"
      runtime.textContent = "2.78s"
    } else if (scriptName === "data_processor.py") {
      lastRun.textContent = "2025-03-29 16:33"
      runtime.textContent = "1.45s"
    } else {
      lastRun.textContent = "Never"
      runtime.textContent = "N/A"
    }
  }

  function updateClock() {
    const now = new Date()
    currentTime.textContent = now.toLocaleTimeString()
    setTimeout(updateClock, 1000)
  }

  function simulateSystemStats() {
    // Simulate changing system stats
    setInterval(() => {
      cpuUsage.textContent = `${Math.floor(Math.random() * 60) + 10}%`
      memUsage.textContent = `${(Math.random() * 2 + 0.5).toFixed(1)}GB`
      netUsage.textContent = `${(Math.random() * 5 + 0.1).toFixed(1)}MB/s`
    }, 3000)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  // Add CSS for new elements
  const style = document.createElement("style")
  style.textContent = `
    .subtitle {
      font-size: 0.7rem;
      color: var(--accent-secondary);
      letter-spacing: 2px;
      margin-top: -5px;
    }
    
    .pentagram {
      color: var(--accent-primary);
      margin-right: 5px;
    }
    
    .demonic-symbol {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
      animation: pulse 2s infinite alternate;
    }
    
    .pentagram-large {
      font-size: 3rem;
      color: var(--accent-primary);
      text-shadow: 0 0 10px var(--accent-primary);
    }
    
    .ritual-text {
      font-size: 1.5rem;
      color: var(--accent-primary);
      margin-top: 10px;
      letter-spacing: 5px;
    }
  `
  document.head.appendChild(style)

  // Elements
  const consoleInput = document.getElementById("console-input")
  const consoleOutput = document.getElementById("console-output")
  const scriptList = document.getElementById("script-list")
  const currentScriptName = document.getElementById("current-script-name")
  const scriptStatus = document.getElementById("script-status")
  const lastRun = document.getElementById("last-run")
  const runtime = document.getElementById("runtime")
  const currentTime = document.getElementById("current-time")
  const cpuUsage = document.getElementById("cpu-usage")
  const memUsage = document.getElementById("mem-usage")
  const netUsage = document.getElementById("net-usage")
  const statusMessage = document.getElementById("status-message")

  // Available commands
  const commands = {
    help: showHelp,
    clear: clearConsole,
    ls: listScripts,
    run: runScript,
    edit: editScript,
    info: showScriptInfo,
    stats: showSystemStats,
    exit: exitConsole,
  }

  // Initialize
  updateClock()
  simulateSystemStats()

  // Event listeners
  consoleInput.addEventListener("keydown", handleInput)

  scriptList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      // Remove active class from all scripts
      document.querySelectorAll(".script-list li").forEach((item) => {
        item.classList.remove("active")
      })

      // Add active class to clicked script
      e.target.classList.add("active")

      // Update current script name
      const scriptName = e.target.getAttribute("data-script")
      currentScriptName.textContent = scriptName

      // Update script info
      updateScriptInfo(scriptName)

      // Add message to console
      addConsoleMessage(`Selected script: ${scriptName}`, "success")
    }
  })

  // Functions
  function handleInput(e) {
    if (e.key === "Enter") {
      const input = consoleInput.value.trim()

      // Add command to console output
      addConsoleMessage(`oni@system:~$ ${input}`)

      // Process command
      processCommand(input)

      // Clear input
      consoleInput.value = ""
    }
  }

  function processCommand(input) {
    if (!input) return

    const args = input.split(" ")
    const command = args[0].toLowerCase()

    if (commands[command]) {
      commands[command](args.slice(1))
    } else {
      addConsoleMessage(`Command not found: ${command}. Type 'help' for available commands.`, "error")
    }
  }

  function addConsoleMessage(message, type = "") {
    const line = document.createElement("div")
    line.className = `line ${type}`
    line.textContent = message

    consoleOutput.appendChild(line)

    // Scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight
  }

  function showHelp() {
    addConsoleMessage("Available commands:")
    addConsoleMessage("  help - Show this help message")
    addConsoleMessage("  clear - Clear the console")
    addConsoleMessage("  ls - List available scripts")
    addConsoleMessage("  run [script] - Run a script")
    addConsoleMessage("  edit [script] - Edit a script")
    addConsoleMessage("  info [script] - Show script information")
    addConsoleMessage("  stats - Show system statistics")
    addConsoleMessage("  exit - Exit the console")
  }

  function clearConsole() {
    consoleOutput.innerHTML = ""
    addConsoleMessage("Console cleared.", "success")
  }

  function listScripts() {
    addConsoleMessage("Available scripts:")

    document.querySelectorAll(".script-list li").forEach((item) => {
      const scriptName = item.getAttribute("data-script")
      addConsoleMessage(`  ${scriptName}`)
    })
  }

  function runScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Running script: ${scriptName}...`)

    // Simulate script execution
    scriptStatus.textContent = "RUNNING"
    statusMessage.textContent = `Running ${scriptName}...`

    // Random execution time between 0.5 and 3 seconds
    const executionTime = (Math.random() * 2.5 + 0.5).toFixed(2)

    setTimeout(() => {
      addConsoleMessage(`Script ${scriptName} executed successfully in ${executionTime}s.`, "success")

      // Update script info
      scriptStatus.textContent = "IDLE"
      const now = new Date()
      lastRun.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
      runtime.textContent = `${executionTime}s`
      statusMessage.textContent = "All systems operational"

      // Add some fake output
      if (scriptName === "network_scan.py") {
        addConsoleMessage("Network scan results:")
        addConsoleMessage("  Devices found: 12")
        addConsoleMessage("  Open ports: 22, 80, 443, 3306")
        addConsoleMessage("  Vulnerabilities detected: 2", "warning")
      } else if (scriptName === "data_processor.py") {
        addConsoleMessage("Data processing complete:")
        addConsoleMessage("  Records processed: 1,245")
        addConsoleMessage("  Errors: 0")
        addConsoleMessage("  Output saved to: /data/processed/output.csv")
      }
    }, executionTime * 1000)
  }

  function editScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Opening ${scriptName} in editor...`)

    // In a real application, this would open the script in an editor
    setTimeout(() => {
      addConsoleMessage("Editor functionality not implemented in this demo.", "warning")
    }, 1000)
  }

  function showScriptInfo(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    addConsoleMessage(`Script information for ${scriptName}:`)

    // Fake script info
    if (scriptName === "main.py") {
      addConsoleMessage("  Description: Main entry point for the application")
      addConsoleMessage("  Size: 4.2 KB")
      addConsoleMessage("  Created: 2025-01-15")
      addConsoleMessage("  Last modified: 2025-03-28")
      addConsoleMessage("  Dependencies: os, sys, numpy, pandas")
    } else if (scriptName === "network_scan.py") {
      addConsoleMessage("  Description: Network scanning and security analysis tool")
      addConsoleMessage("  Size: 8.7 KB")
      addConsoleMessage("  Created: 2025-02-10")
      addConsoleMessage("  Last modified: 2025-03-25")
      addConsoleMessage("  Dependencies: socket, nmap, scapy")
    } else {
      addConsoleMessage("  Description: Python script")
      addConsoleMessage("  Size: 2.1 KB")
      addConsoleMessage("  Created: 2025-03-01")
      addConsoleMessage("  Last modified: 2025-03-20")
      addConsoleMessage("  Dependencies: os, sys")
    }
  }

  function showSystemStats() {
    addConsoleMessage("System Statistics:")
    addConsoleMessage(`  CPU Usage: ${cpuUsage.textContent}`)
    addConsoleMessage(`  Memory Usage: ${memUsage.textContent}`)
    addConsoleMessage(`  Network Usage: ${netUsage.textContent}`)
    addConsoleMessage(`  Uptime: 3 days, 7 hours, 22 minutes`)
    addConsoleMessage(`  Python Version: 3.12.0`)
    addConsoleMessage(`  OS: Linux 6.2.0-26-generic`)
  }

  function exitConsole() {
    addConsoleMessage("Exiting console...")

    setTimeout(() => {
      addConsoleMessage("This is a demo. The console cannot be exited.", "warning")
    }, 1000)
  }

  function updateScriptInfo(scriptName) {
    // Fake script info
    if (scriptName === "main.py") {
      lastRun.textContent = "2025-03-31 14:45"
      runtime.textContent = "0.32s"
    } else if (scriptName === "network_scan.py") {
      lastRun.textContent = "2025-03-30 09:12"
      runtime.textContent = "2.78s"
    } else if (scriptName === "data_processor.py") {
      lastRun.textContent = "2025-03-29 16:33"
      runtime.textContent = "1.45s"
    } else {
      lastRun.textContent = "Never"
      runtime.textContent = "N/A"
    }
  }

  function updateClock() {
    const now = new Date()
    currentTime.textContent = now.toLocaleTimeString()
    setTimeout(updateClock, 1000)
  }

  function simulateSystemStats() {
    // Simulate changing system stats
    setInterval(() => {
      cpuUsage.textContent = `${Math.floor(Math.random() * 60) + 10}%`
      memUsage.textContent = `${(Math.random() * 2 + 0.5).toFixed(1)}GB`
      netUsage.textContent = `${(Math.random() * 5 + 0.1).toFixed(1)}MB/s`
    }, 3000)
  }
})


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
  const themeToggle = document.getElementById("theme-toggle")
  const tabs = document.querySelectorAll(".tab")
  const tabContents = document.querySelectorAll(".tab-content")
  const codeEditor = document.getElementById("code-editor")
  const editorFilename = document.getElementById("editor-filename")
  const scriptOutput = document.getElementById("script-output")
  const newScriptBtn = document.getElementById("new-script")
  const newScriptModal = document.getElementById("new-script-modal")
  const modalCloseButtons = document.querySelectorAll(".modal-close")
  const createScriptBtn = document.getElementById("create-script-btn")
  const deleteScriptBtn = document.getElementById("delete-script")
  const saveFileBtn = document.getElementById("save-file")
  const runFileBtn = document.getElementById("run-file")
  const clearOutputBtn = document.getElementById("clear-output")
  const categoryButtons = document.querySelectorAll(".category-btn")
  const aiToggles = document.querySelectorAll(".ai-toggle")
  const chatInput = document.getElementById("chat-input")
  const sendMessageBtn = document.getElementById("send-message")
  const chatMessages = document.getElementById("chat-messages")
  const clearChatBtn = document.getElementById("clear-chat")
  const chatAssistantBtns = document.querySelectorAll(".chat-assistant-btn")

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
    create: createScript,
    delete: deleteScript,
    cat: viewScript,
    ai: toggleAI,
  }

  // Script templates
  const scriptTemplates = {
    blank: "",
    basic: `#!/usr/bin/env python3
# Basic script template
# Created: ${new Date().toISOString().split("T")[0]}

def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()
`,
    ai: `#!/usr/bin/env python3
# AI script template
# Created: ${new Date().toISOString().split("T")[0]}

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

def load_data():
    # Load your data here
    pass

def preprocess_data(data):
    # Preprocess your data here
    pass

def train_model(X_train, y_train):
    # Train your model here
    model = LogisticRegression()
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    # Evaluate your model here
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")
    return accuracy

def main():
    print("Starting AI script...")
    # Implement your AI logic here
    print("AI script completed.")

if __name__ == "__main__":
    main()
`,
    data: `#!/usr/bin/env python3
# Data processing template
# Created: ${new Date().toISOString().split("T")[0]}

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def load_data(file_path):
    # Load your data here
    try:
        data = pd.read_csv(file_path)
        print(f"Loaded data with {data.shape[0]} rows and {data.shape[1]} columns")
        return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def clean_data(data):
    # Clean your data here
    print("Cleaning data...")
    # Remove duplicates
    data = data.drop_duplicates()
    # Handle missing values
    data = data.fillna(0)  # Example: fill with zeros
    return data

def analyze_data(data):
    # Analyze your data here
    print("Analyzing data...")
    # Example: basic statistics
    print(data.describe())
    return data

def visualize_data(data):
    # Visualize your data here
    print("Generating visualizations...")
    # Example: would create plots in a real implementation

def export_data(data, output_path):
    # Export your processed data
    try:
        data.to_csv(output_path, index=False)
        print(f"Data exported to {output_path}")
    except Exception as e:
        print(f"Error exporting data: {e}")

def main():
    print("Starting data processing...")
    # Implement your data processing logic here
    print("Data processing completed.")

if __name__ == "__main__":
    main()
`,
  }

  // Initialize
  updateClock()
  simulateSystemStats()

  // Event listeners
  consoleInput.addEventListener("keydown", handleInput)

  scriptList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" || e.target.parentElement.tagName === "LI") {
      const listItem = e.target.tagName === "LI" ? e.target : e.target.parentElement

      // Remove active class from all scripts
      document.querySelectorAll(".script-list li").forEach((item) => {
        item.classList.remove("active")
      })

      // Add active class to clicked script
      listItem.classList.add("active")

      // Update current script name
      const scriptName = listItem.getAttribute("data-script")
      currentScriptName.textContent = scriptName

      // Update script info
      updateScriptInfo(scriptName)

      // Add message to console
      addConsoleMessage(`Selected script: ${scriptName}`, "success")

      // Update editor if editor tab is active
      if (document.querySelector('.tab[data-tab="editor"]').classList.contains("active")) {
        loadScriptInEditor(scriptName)
      }
    }
  })

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    document.body.classList.toggle("light-theme")

    // Save theme preference
    const isDarkTheme = document.body.classList.contains("dark-theme")
    localStorage.setItem("darkTheme", isDarkTheme)

    addConsoleMessage(`Switched to ${isDarkTheme ? "dark" : "light"} theme`, "success")
  })

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")

      // If editor tab is selected, load the current script
      if (tabId === "editor") {
        loadScriptInEditor(currentScriptName.textContent)
      }
    })
  })

  // New script modal
  newScriptBtn.addEventListener("click", () => {
    newScriptModal.style.display = "flex"
  })

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      newScriptModal.style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === newScriptModal) {
      newScriptModal.style.display = "none"
    }
  })

  // Create new script
  createScriptBtn.addEventListener("click", () => {
    const scriptName = document.getElementById("new-script-name").value.trim()
    const category = document.getElementById("new-script-category").value
    const template = document.getElementById("new-script-template").value

    if (!scriptName) {
      alert("Please enter a script name")
      return
    }

    // Add .py extension if not present
    const fileName = scriptName.endsWith(".py") ? scriptName : `${scriptName}.py`

    // Create new script
    createNewScript(fileName, category, template)

    // Close modal
    newScriptModal.style.display = "none"

    // Clear form
    document.getElementById("new-script-name").value = ""
  })

  // Delete script
  deleteScriptBtn.addEventListener("click", () => {
    const scriptName = currentScriptName.textContent

    if (confirm(`Are you sure you want to delete ${scriptName}?`)) {
      deleteCurrentScript()
    }
  })

  // Save file
  saveFileBtn.addEventListener("click", () => {
    saveCurrentScript()
  })

  // Run file
  runFileBtn.addEventListener("click", () => {
    runCurrentScript()
  })

  // Clear output
  clearOutputBtn.addEventListener("click", () => {
    clearScriptOutput()
  })

  // Category filtering
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category")

      // Remove active class from all category buttons
      categoryButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Filter scripts
      filterScripts(category)
    })
  })

  // AI toggles
  aiToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const aiId = this.parentElement.id
      toggleAIAssistant(aiId)
    })
  })

  // Send chat message
  sendMessageBtn.addEventListener("click", sendChatMessage)
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  })

  // Clear chat
  clearChatBtn.addEventListener("click", () => {
    clearChat()
  })

  // Switch chat assistant
  chatAssistantBtns.forEach((button) => {
    button.addEventListener("click", function () {
      const assistant = this.getAttribute("data-assistant")

      // Remove active class from all assistant buttons
      chatAssistantBtns.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Update chat interface
      updateChatAssistant(assistant)
    })
  })

  // Load theme preference
  if (localStorage.getItem("darkTheme") === "true") {
    document.body.classList.add("dark-theme")
    document.body.classList.remove("light-theme")
  }

  // Functions
  function handleInput(e) {
    if (e.key === "Enter") {
      const input = consoleInput.value.trim()

      // Add command to console output
      addConsoleMessage(`samurai@system:~$ ${input}`)

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
    addConsoleMessage("  edit [script] - Edit a script in the editor")
    addConsoleMessage("  cat [script] - View script content")
    addConsoleMessage("  info [script] - Show script information")
    addConsoleMessage("  stats - Show system statistics")
    addConsoleMessage("  create [name] - Create a new script")
    addConsoleMessage("  delete [script] - Delete a script")
    addConsoleMessage("  ai [name] [start|stop] - Control AI assistants")
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
      const category = item.getAttribute("data-category")
      addConsoleMessage(`  ${scriptName} [${category}]`)
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

      // Add some fake output to the output tab
      addScriptOutput(`Running ${scriptName}...`)

      // Add script-specific output
      if (scriptName === "network_scan.py") {
        addScriptOutput("Network scan results:")
        addScriptOutput("  Devices found: 12")
        addScriptOutput("  Open ports: 22, 80, 443, 3306")
        addScriptOutput("  Vulnerabilities detected: 2")
        addScriptOutput("Scan completed successfully.")
      } else if (scriptName === "data_processor.py") {
        addScriptOutput("Data processing started...")
        addScriptOutput("Loading data from source...")
        addScriptOutput("  Records loaded: 1,245")
        addScriptOutput("Processing data...")
        addScriptOutput("  Cleaning records...")
        addScriptOutput("  Transforming data...")
        addScriptOutput("  Analyzing results...")
        addScriptOutput("Data processing completed.")
        addScriptOutput("  Records processed: 1,245")
        addScriptOutput("  Errors: 0")
        addScriptOutput("  Output saved to: /data/processed/output.csv")
      } else if (scriptName === "samurai_ai.py" || scriptName === "assistant_ai.py") {
        addScriptOutput("Initializing AI model...")
        addScriptOutput("Loading neural network weights...")
        addScriptOutput("Setting up communication channels...")
        addScriptOutput("AI system ready.")

        // Also update the AI assistant status
        const aiId = scriptName === "samurai_ai.py" ? "samurai-ai" : "assistant-ai"
        const aiElement = document.getElementById(aiId)
        const statusElement = aiElement.querySelector(".ai-status")
        const toggleButton = aiElement.querySelector(".ai-toggle")

        statusElement.textContent = "Online"
        statusElement.classList.remove("offline")
        toggleButton.textContent = "Stop"
      } else {
        addScriptOutput(`Executing ${scriptName}...`)
        addScriptOutput("Hello, world!")
        addScriptOutput("Script execution completed.")
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

    // Switch to editor tab
    tabs.forEach((tab) => tab.classList.remove("active"))
    tabContents.forEach((content) => content.classList.remove("active"))

    document.querySelector('.tab[data-tab="editor"]').classList.add("active")
    document.getElementById("editor-tab").classList.add("active")

    // Load script in editor
    loadScriptInEditor(scriptName)
  }

  function viewScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    // Simulate viewing script content
    addConsoleMessage(`Content of ${scriptName}:`)

    // Get script content (in a real app, this would read from a file)
    const scriptContent = getScriptContent(scriptName)

    // Display script content
    scriptContent.split("\n").forEach((line) => {
      addConsoleMessage(`  ${line}`)
    })
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
    } else if (scriptName === "samurai_ai.py") {
      addConsoleMessage("  Description: Samurai AI assistant implementation")
      addConsoleMessage("  Size: 12.3 KB")
      addConsoleMessage("  Created: 2025-02-05")
      addConsoleMessage("  Last modified: 2025-03-30")
      addConsoleMessage("  Dependencies: tensorflow, numpy, nltk, transformers")
    } else if (scriptName === "assistant_ai.py") {
      addConsoleMessage("  Description: General purpose AI assistant")
      addConsoleMessage("  Size: 10.1 KB")
      addConsoleMessage("  Created: 2025-02-15")
      addConsoleMessage("  Last modified: 2025-03-20")
      addConsoleMessage("  Dependencies: tensorflow, numpy, nltk, transformers")
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

  function createScript(args) {
    const scriptName = args[0]

    if (!scriptName) {
      addConsoleMessage("No script name specified.", "error")
      return
    }

    // Add .py extension if not present
    const fileName = scriptName.endsWith(".py") ? scriptName : `${scriptName}.py`

    // Create new script with default template
    createNewScript(fileName, "all", "basic")
  }

  function deleteScript(args) {
    const scriptName = args[0] || currentScriptName.textContent

    if (!scriptName) {
      addConsoleMessage("No script specified.", "error")
      return
    }

    if (confirm(`Are you sure you want to delete ${scriptName}?`)) {
      deleteScriptByName(scriptName)
    }
  }

  function toggleAI(args) {
    if (args.length < 1) {
      addConsoleMessage("Usage: ai [samurai|assistant] [start|stop]", "error")
      return
    }

    const aiName = args[0].toLowerCase()
    const action = args[1] ? args[1].toLowerCase() : "toggle"

    if (aiName !== "samurai" && aiName !== "assistant") {
      addConsoleMessage(`Unknown AI: ${aiName}. Available AIs: samurai, assistant`, "error")
      return
    }

    const aiId = aiName === "samurai" ? "samurai-ai" : "assistant-ai"

    if (action === "start") {
      startAI(aiId)
    } else if (action === "stop") {
      stopAI(aiId)
    } else {
      toggleAIAssistant(aiId)
    }
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
    } else if (scriptName === "samurai_ai.py") {
      lastRun.textContent = "2025-03-31 08:15"
      runtime.textContent = "Running"
    } else if (scriptName === "assistant_ai.py") {
      lastRun.textContent = "Never"
      runtime.textContent = "N/A"
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

  function loadScriptInEditor(scriptName) {
    if (!scriptName) return

    editorFilename.textContent = scriptName

    // Get script content (in a real app, this would read from a file)
    const scriptContent = getScriptContent(scriptName)

    // Set editor content
    codeEditor.value = scriptContent
  }

  function getScriptContent(scriptName) {
    // In a real app, this would read from a file
    // Here we'll return fake content based on the script name
    if (scriptName === "main.py") {
      return `#!/usr/bin/env python3
# Main application entry point

import os
import sys
import numpy as np
import pandas as pd

def main():
    print("Starting application...")
    # Main application logic would go here
    print("Application finished.")

if __name__ == "__main__":
    main()
`
    } else if (scriptName === "network_scan.py") {
      return `#!/usr/bin/env python3
# Network scanning tool

import socket
import subprocess
import sys
from datetime import datetime

def scan_network(target):
    print(f"Scanning target: {target}")
    print("Time started: " + str(datetime.now()))
    
    try:
        for port in range(1, 1025):
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            socket.setdefaulttimeout(1)
            result = s.connect_ex((target, port))
            if result == 0:
                print(f"Port {port} is open")
            s.close()
    
    except KeyboardInterrupt:
        print("Scan interrupted.")
        sys.exit()
    except socket.gaierror:
        print("Hostname could not be resolved.")
        sys.exit()
    except socket.error:
        print("Could not connect to server.")
        sys.exit()

def main():
    target = "127.0.0.1"  # Default to localhost
    scan_network(target)
    print("Scan completed.")

if __name__ == "__main__":
    main()
`
    } else if (scriptName === "data_processor.py") {
      return `#!/usr/bin/env python3
# Data processing script

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def load_data(file_path):
    print(f"Loading data from {file_path}")
    try:
        data = pd.read_csv(file_path)
        print(f"Loaded {data.shape[0]} rows and {data.shape[1]} columns")
        return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def process_data(data):
    print("Processing data...")
    # Example processing steps
    data = data.dropna()  # Drop rows with missing values
    data = data.drop_duplicates()  # Remove duplicates
    
    # More processing would go here in a real application
    
    return data

def save_results(data, output_path):
    print(f"Saving results to {output_path}")
    data.to_csv(output_path, index=False)
    print("Results saved successfully")

def main():
    input_file = "data/input.csv"
    output_file = "data/processed/output.csv"
    
    data = load_data(input_file)
    if data is not None:
        processed_data = process_data(data)
        save_results(processed_data, output_file)
    
    print("Data processing completed")

if __name__ == "__main__":
    main()
`
    } else if (scriptName === "samurai_ai.py") {
      return `#!/usr/bin/env python3
# Samurai AI Assistant

import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForCausalLM

class SamuraiAI:
    def __init__(self):
        print("Initializing Samurai AI...")
        self.name = "Samurai"
        self.personality = "Loyal, disciplined, honorable, and precise"
        
        # In a real implementation, this would load actual models
        print("Loading language model...")
        self.tokenizer = None
        self.model = None
        
    def initialize(self):
        print("Setting up communication channels...")
        # Setup would happen here
        print("Samurai AI is ready to serve.")
        
    def process_message(self, message):
        print(f"Processing message: {message}")
        # In a real implementation, this would use the language model
        
        # Simple rule-based responses for demo
        if "hello" in message.lower():
            return "Greetings. I am Samurai, your loyal assistant."
        elif "help" in message.lower():
            return "I am here to serve. How may I assist you today?"
        else:
            return "I understand. I will handle this task with precision and honor."
    
    def shutdown(self):
        print("Shutting down Samurai AI...")
        # Cleanup would happen here
        print("Samurai AI has been deactivated.")

def main():
    ai = SamuraiAI()
    ai.initialize()
    
    # Example interaction
    response = ai.process_message("Hello, Samurai")
    print(f"AI response: {response}")
    
    ai.shutdown()

if __name__ == "__main__":
    main()
`
    } else if (scriptName === "assistant_ai.py") {
      return `#!/usr/bin/env python3
# General Assistant AI

import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForCausalLM

class AssistantAI:
    def __init__(self):
        print("Initializing Assistant AI...")
        self.name = "Assistant"
        self.personality = "Helpful, friendly, and informative"
        
        # In a real implementation, this would load actual models
        print("Loading language model...")
        self.tokenizer = None
        self.model = None
        
    def initialize(self):
        print("Setting up communication channels...")
        # Setup would happen here
        print("Assistant AI is ready to help.")
        
    def process_message(self, message):
        print(f"Processing message: {message}")
        # In a real implementation, this would use the language model
        
        # Simple rule-based responses for demo
        if "hello" in message.lower():
            return "Hi there! How can I help you today?"
        elif "help" in message.lower():
            return "I'm here to help with whatever you need. Just let me know!"
        else:
            return "I'll do my best to assist you with that. Let me know if you need anything else!"
    
    def shutdown(self):
        print("Shutting down Assistant AI...")
        # Cleanup would happen here
        print("Assistant AI has been deactivated.")

def main():
    ai = AssistantAI()
    ai.initialize()
    
    # Example interaction
    response = ai.process_message("Hello, Assistant")
    print(f"AI response: {response}")
    
    ai.shutdown()

if __name__ == "__main__":
    main()
`
    } else if (scriptName === "image_analyzer.py") {
      return `#!/usr/bin/env python3
# Image analysis script

import numpy as np
import cv2
from PIL import Image

def load_image(image_path):
    print(f"Loading image from {image_path}")
    try:
        image = Image.open(image_path)
        print(f"Loaded image of size {image.size}")
        return image
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def analyze_image(image):
    print("Analyzing image...")
    # Convert to numpy array for processing
    img_array = np.array(image)
    
    # Example analysis: calculate color histograms
    print("Calculating color distribution...")
    
    # In a real implementation, this would do actual image analysis
    
    return {
        "size": image.size,
        "format": image.format,
        "mode": image.mode,
        "analysis": "Example analysis results"
    }

def main():
    image_path = "images/sample.jpg"
    
    image = load_image(image_path)
    if image is not None:
        results = analyze_image(image)
        print("Analysis results:")
        for key, value in results.items():
            print(f"  {key}: {value}")
    
    print("Image analysis completed")

if __name__ == "__main__":
    main()
`
    } else {
      return `#!/usr/bin/env python3
# ${scriptName}
# Created: ${new Date().toISOString().split("T")[0]}

def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()
`
    }
  }

  function saveCurrentScript() {
    const scriptName = editorFilename.textContent
    const content = codeEditor.value

    if (!scriptName || scriptName === "No file selected") {
      alert("No file selected")
      return
    }

    // In a real app, this would save to a file
    addConsoleMessage(`Saved ${scriptName}`, "success")

    // Update script info
    const now = new Date()
    lastRun.textContent = "Never"
    runtime.textContent = "N/A"

    // Add message to console output
    addConsoleMessage(`File ${scriptName} saved successfully.`, "success")
  }

  function runCurrentScript() {
    const scriptName = editorFilename.textContent

    if (!scriptName || scriptName === "No file selected") {
      alert("No file selected")
      return
    }

    // Save before running
    saveCurrentScript()

    // Run the script
    runScript([scriptName])
  }

  function addScriptOutput(message) {
    const line = document.createElement("div")
    line.className = "output-line"
    line.textContent = message

    scriptOutput.appendChild(line)

    // Scroll to bottom
    scriptOutput.scrollTop = scriptOutput.scrollHeight
  }

  function clearScriptOutput() {
    scriptOutput.innerHTML = ""
    addScriptOutput("Output cleared.")
  }

  function createNewScript(fileName, category, template) {
    // Check if script already exists
    const existingScript = document.querySelector(`.script-list li[data-script="${fileName}"]`)
    if (existingScript) {
      addConsoleMessage(`Script ${fileName} already exists.`, "error")
      return
    }

    // Create new script element
    const newScript = document.createElement("li")
    newScript.setAttribute("data-script", fileName)
    newScript.setAttribute("data-category", category)

    // Add icon based on category
    let icon = "📄"
    if (category === "ai") icon = "🤖"
    else if (category === "data") icon = "📊"
    else if (category === "network") icon = "🔍"

    newScript.innerHTML = `<span class="script-icon">${icon}</span>${fileName}`

    // Add to script list
    scriptList.appendChild(newScript)

    // Select the new script
    document.querySelectorAll(".script-list li").forEach((item) => {
      item.classList.remove("active")
    })
    newScript.classList.add("active")
    currentScriptName.textContent = fileName

    // Update script info
    updateScriptInfo(fileName)

    // Add message to console
    addConsoleMessage(`Created new script: ${fileName}`, "success")

    // Load template in editor
    editorFilename.textContent = fileName
    codeEditor.value = scriptTemplates[template] || scriptTemplates.blank

    // Switch to editor tab
    tabs.forEach((tab) => tab.classList.remove("active"))
    tabContents.forEach((content) => content.classList.remove("active"))
    document.querySelector('.tab[data-tab="editor"]').classList.add("active")
    document.getElementById("editor-tab").classList.add("active")
  }

  function deleteCurrentScript() {
    const scriptName = currentScriptName.textContent
    deleteScriptByName(scriptName)
  }

  function deleteScriptByName(scriptName) {
    // Find script element
    const scriptElement = document.querySelector(`.script-list li[data-script="${scriptName}"]`)

    if (!scriptElement) {
      addConsoleMessage(`Script ${scriptName} not found.`, "error")
      return
    }

    // Remove script element
    scriptElement.remove()

    // Select first script or show "No script selected"
    const firstScript = document.querySelector(".script-list li")
    if (firstScript) {
      firstScript.classList.add("active")
      currentScriptName.textContent = firstScript.getAttribute("data-script")
      updateScriptInfo(currentScriptName.textContent)
    } else {
      currentScriptName.textContent = "No script selected"
      lastRun.textContent = "N/A"
      runtime.textContent = "N/A"
    }

    // Clear editor if the deleted script was open
    if (editorFilename.textContent === scriptName) {
      editorFilename.textContent = "No file selected"
      codeEditor.value = ""
    }

    // Add message to console
    addConsoleMessage(`Deleted script: ${scriptName}`, "success")
  }

  function filterScripts(category) {
    const scripts = document.querySelectorAll(".script-list li")

    scripts.forEach((script) => {
      const scriptCategory = script.getAttribute("data-category")

      if (category === "all" || scriptCategory === category) {
        script.style.display = ""
      } else {
        script.style.display = "none"
      }
    })
  }

  function toggleAIAssistant(aiId) {
    const aiElement = document.getElementById(aiId)
    const statusElement = aiElement.querySelector(".ai-status")
    const toggleButton = aiElement.querySelector(".ai-toggle")

    if (statusElement.classList.contains("offline")) {
      // Start AI
      startAI(aiId)
    } else {
      // Stop AI
      stopAI(aiId)
    }
  }

  function startAI(aiId) {
    const aiElement = document.getElementById(aiId)
    const statusElement = aiElement.querySelector(".ai-status")
    const toggleButton = aiElement.querySelector(".ai-toggle")
    const aiName = aiId === "samurai-ai" ? "Samurai" : "Assistant"

    // Update UI
    statusElement.textContent = "Starting..."
    toggleButton.disabled = true

    // Simulate startup
    setTimeout(() => {
      statusElement.textContent = "Online"
      statusElement.classList.remove("offline")
      toggleButton.textContent = "Stop"
      toggleButton.disabled = false

      // Add message to console
      addConsoleMessage(`${aiName} AI is now online.`, "success")

      // Add message to chat if it's the active assistant
      const activeAssistant = document.querySelector(".chat-assistant-btn.active").getAttribute("data-assistant")
      if (
        (aiId === "samurai-ai" && activeAssistant === "samurai") ||
        (aiId === "assistant-ai" && activeAssistant === "assistant")
      ) {
        addChatMessage(`I am ${aiName}, and I am now online and ready to assist you.`, "ai")
      }
    }, 2000)
  }

  function stopAI(aiId) {
    const aiElement = document.getElementById(aiId)
    const statusElement = aiElement.querySelector(".ai-status")
    const toggleButton = aiElement.querySelector(".ai-toggle")
    const aiName = aiId === "samurai-ai" ? "Samurai" : "Assistant"

    // Update UI
    statusElement.textContent = "Shutting down..."
    toggleButton.disabled = true

    // Simulate shutdown
    setTimeout(() => {
      statusElement.textContent = "Offline"
      statusElement.classList.add("offline")
      toggleButton.textContent = "Start"
      toggleButton.disabled = false

      // Add message to console
      addConsoleMessage(`${aiName} AI is now offline.`, "success")

      // Add message to chat if it's the active assistant
      const activeAssistant = document.querySelector(".chat-assistant-btn.active").getAttribute("data-assistant")
      if (
        (aiId === "samurai-ai" && activeAssistant === "samurai") ||
        (aiId === "assistant-ai" && activeAssistant === "assistant")
      ) {
        addChatMessage(`${aiName} AI is now offline.`, "system")
      }
    }, 1500)
  }

  function sendChatMessage() {
    const message = chatInput.value.trim()

    if (!message) return

    // Get active assistant
    const activeAssistant = document.querySelector(".chat-assistant-btn.active").getAttribute("data-assistant")
    const aiId = activeAssistant === "samurai" ? "samurai-ai" : "assistant-ai"
    const aiElement = document.getElementById(aiId)
    const statusElement = aiElement.querySelector(".ai-status")

    // Add user message to chat
    addChatMessage(message, "user")

    // Clear input
    chatInput.value = ""

    // Check if AI is online
    if (statusElement.classList.contains("offline")) {
      addChatMessage(`The ${activeAssistant} AI is currently offline. Please start it first.`, "system")
      return
    }

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (activeAssistant === "samurai") {
        if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
          response = "Greetings. I am Samurai, your loyal assistant. How may I serve you today?"
        } else if (message.toLowerCase().includes("help")) {
          response =
            "I am here to serve. I can help you manage your scripts, analyze data, or perform network scans. What task shall we undertake?"
        } else if (message.toLowerCase().includes("thank")) {
          response = "It is my honor to be of service."
        } else {
          response = "I understand. I will handle this task with precision and honor."
        }
      } else {
        if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
          response = "Hi there! How can I help you today?"
        } else if (message.toLowerCase().includes("help")) {
          response =
            "I'm here to help with whatever you need. I can assist with script management, data analysis, or just answer questions. Just let me know!"
        } else if (message.toLowerCase().includes("thank")) {
          response = "You're welcome! Let me know if you need anything else."
        } else {
          response = "I'll do my best to assist you with that. Let me know if you need anything else!"
        }
      }

      addChatMessage(response, "ai")
    }, 1000)
  }

  function addChatMessage(message, type) {
    const messageElement = document.createElement("div")
    messageElement.className = `chat-message ${type}`

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"
    messageContent.textContent = message

    messageElement.appendChild(messageContent)
    chatMessages.appendChild(messageElement)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function clearChat() {
    chatMessages.innerHTML = ""
    addChatMessage("Chat cleared.", "system")
  }

  function updateChatAssistant(assistant) {
    // Add system message about switching
    addChatMessage(`Switched to ${assistant === "samurai" ? "Samurai" : "Assistant"} AI.`, "system")

    // Check if AI is online
    const aiId = assistant === "samurai" ? "samurai-ai" : "assistant-ai"
    const aiElement = document.getElementById(aiId)
    const statusElement = aiElement.querySelector(".ai-status")

    if (!statusElement.classList.contains("offline")) {
      // Add greeting from AI
      if (assistant === "samurai") {
        addChatMessage("Greetings. I am Samurai, your loyal assistant. How may I serve you today?", "ai")
      } else {
        addChatMessage("Hi there! I'm your friendly assistant. How can I help you today?", "ai")
      }
    }
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


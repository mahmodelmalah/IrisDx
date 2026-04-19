document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const scanBtn = document.getElementById('scan-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scanLine = document.getElementById('scan-line');
    
    // Right panel elements
    const statusIndicator = document.getElementById('status-indicator');
    const processingState = document.getElementById('processing-state');
    const resultsData = document.getElementById('results-data');
    const progressBar = document.getElementById('progress-bar');
    const steps = document.querySelectorAll('.processing-steps li');
    
    // Result elements
    const subjectIdEl = document.getElementById('subject-id');
    const confidenceValEl = document.getElementById('confidence-val');
    const modeValEl = document.getElementById('mode-val');
    const systemMessageEl = document.getElementById('system-message');

    let currentFile = null;

    // --- Event Listeners ---

    browseBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    scanBtn.addEventListener('click', initiateScan);
    resetBtn.addEventListener('click', resetUI);

    // --- Core Functions ---

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        currentFile = file;

        // Display image
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadPrompt.classList.add('hidden');
            imagePreviewContainer.classList.remove('hidden');
            
            // Enable controls
            scanBtn.classList.remove('hidden');
            scanBtn.disabled = false;
            resetBtn.classList.remove('hidden');

            // Update badge
            document.querySelector('.scanner-panel .badge').textContent = "Ready for Scan";
            document.querySelector('.scanner-panel .badge').style.color = "var(--accent-success)";
        };
        reader.readAsDataURL(file);
    }

    async function initiateScan() {
        if (!currentFile) return;

        // Update UI for scanning
        scanBtn.disabled = true;
        scanBtn.innerHTML = '<i class="ph ph-spinner-gap"></i> Processing...';
        imagePreviewContainer.classList.add('scanning');
        scanLine.classList.remove('hidden');
        document.querySelector('.scanner-panel .badge').textContent = "Scanning...";

        // Right panel transition
        statusIndicator.classList.add('hidden');
        processingState.classList.remove('hidden');
        resultsData.classList.add('hidden');

        // Simulate progress steps (for visual effect)
        animateProgress();

        // Prepare Data
        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                displayResults(data);
            } else {
                showError(data.error || 'An error occurred during analysis.');
            }

        } catch (err) {
            console.error(err);
            showError('Failed to connect to diagnostic server.');
        } finally {
            // Stop scanning UI
            scanLine.classList.add('hidden');
            imagePreviewContainer.classList.remove('scanning');
            scanBtn.innerHTML = '<i class="ph ph-check-circle"></i> Scan Complete';
            document.querySelector('.scanner-panel .badge').textContent = "Analysis Complete";
        }
    }

    function animateProgress() {
        let progress = 0;
        let stepIndex = 0;

        // Reset steps
        steps.forEach(s => { s.classList.remove('active', 'done'); });
        steps[0].classList.add('active');

        const interval = setInterval(() => {
            progress += 2;
            progressBar.style.width = `${progress}%`;

            if (progress === 25 || progress === 50 || progress === 75) {
                steps[stepIndex].classList.remove('active');
                steps[stepIndex].classList.add('done');
                stepIndex++;
                if (stepIndex < steps.length) {
                    steps[stepIndex].classList.add('active');
                }
            }

            if (progress >= 100) {
                clearInterval(interval);
                steps[stepIndex].classList.remove('active');
                steps[stepIndex].classList.add('done');
            }
        }, 50); // 2.5s total match with backend simulated delay
    }

    function displayResults(data) {
        setTimeout(() => {
            processingState.classList.add('hidden');
            resultsData.classList.remove('hidden');

            subjectIdEl.textContent = data.subject_id;
            
            // Format confidence
            const confPct = (data.confidence * 100).toFixed(2);
            confidenceValEl.textContent = `${confPct}%`;
            
            // Color code based on confidence
            if (data.confidence > 0.9) {
                confidenceValEl.style.color = "var(--accent-success)";
            } else if (data.confidence > 0.7) {
                confidenceValEl.style.color = "#ffcc00";
            } else {
                confidenceValEl.style.color = "var(--accent-danger)";
            }

            modeValEl.textContent = data.is_mock ? "Mock Mode" : "Neural Net";
            if (data.is_mock) {
                modeValEl.style.color = "#ffcc00"; // Warning color for mock
                systemMessageEl.textContent = "Warning: Running in MOCK MODE. Model 'IRISRecognizer1.h5' not detected. Showing simulated results.";
            } else {
                modeValEl.style.color = "var(--text-main)";
                systemMessageEl.textContent = "Match confirmed within acceptable clinical tolerance. Biometric signature verified.";
            }

        }, 500);
    }

    function showError(message) {
        processingState.classList.add('hidden');
        statusIndicator.classList.remove('hidden');
        statusIndicator.innerHTML = `<i class="ph ph-warning-circle" style="color: var(--accent-danger)"></i><p style="color: var(--accent-danger)">${message}</p>`;
    }

    function resetUI() {
        currentFile = null;
        fileInput.value = '';
        
        uploadPrompt.classList.remove('hidden');
        imagePreviewContainer.classList.add('hidden');
        imagePreview.src = '';
        
        scanBtn.classList.add('hidden');
        scanBtn.innerHTML = '<i class="ph ph-radar"></i> Initiate Analysis';
        resetBtn.classList.add('hidden');
        
        statusIndicator.classList.remove('hidden');
        statusIndicator.innerHTML = '<i class="ph ph-placeholder"></i><p>Awaiting scan initiation...</p>';
        processingState.classList.add('hidden');
        resultsData.classList.add('hidden');
        
        progressBar.style.width = '0%';
        document.querySelector('.scanner-panel .badge').textContent = "Awaiting Image";
        document.querySelector('.scanner-panel .badge').style.color = "var(--text-muted)";
    }
});

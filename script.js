            const input = document.getElementById('fileInput');
            const dropZone = document.getElementById('dropZone');
            const msg = document.getElementById('msg');
            const img = document.getElementById('preview');
            const meta = document.getElementById('meta');
            const container = document.getElementById('previewContainer');

            dropZone.addEventListener('click', () => input.click());
            dropZone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
            });

            // Selección
            input.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                handleFile(file);
            });

            // Drag & Drop
            ['dragenter', 'dragover'].forEach(evt =>
                dropZone.addEventListener(evt, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropZone.classList.add('dragover');
                setMsg('Soltá la imagen…');
                })
            );

            ['dragleave', 'dragend', 'drop'].forEach(evt =>
                dropZone.addEventListener(evt, (e) => {
                e.preventDefault(); e.stopPropagation();
                if (evt !== 'drop') dropZone.classList.remove('dragover');
                })
            );

            dropZone.addEventListener('drop', (e) => {
                dropZone.classList.remove('dragover');
                const files = e.dataTransfer?.files;
                if (!files || files.length === 0) {
                setMsg('No se soltó ningún archivo.');
                return;
                }
                if (files.length > 1) setMsg('Se usará solo el primer archivo.');
                handleFile(files[0]);
            });

            function handleFile(file) {
                resetPreview();

                if (!file) {
                    setMsg('No seleccionaste ningún archivo.');
                    return;
                }

                const isImageMime = file.type && file.type.startsWith('image/');
                const isImageExt = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);

                if (!isImageMime && !isImageExt) {
                    setMsg('El archivo seleccionado no es una imagen válida.');
                    return;
                }

                const reader = new FileReader();
                reader.onerror = () => setMsg('No se pudo leer el archivo.');
                reader.onload = () => {
                    img.src = reader.result; // Data URL
                    img.onload = () => {
                        container.classList.remove('hidden');
                        meta.textContent = `${file.name} — ${formatBytes(file.size)} — ${img.naturalWidth}×${img.naturalHeight}px`;
                        setMsg('Imagen cargada correctamente.');
                    };
                };
                reader.readAsDataURL(file);
            }

            function setMsg(texto) { msg.textContent = texto; }

            function resetPreview() {
                img.removeAttribute('src');
                meta.textContent = '';
                container.classList.add('hidden');
                setMsg('');
            }

            function formatBytes(bytes) {
                const units = ['B', 'KB', 'MB', 'GB'];
                let i = 0, n = bytes;
                while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
                const precision = (n < 10 && i > 0) ? 1 : 0;
                return `${n.toFixed(precision)} ${units[i]}`;
            }
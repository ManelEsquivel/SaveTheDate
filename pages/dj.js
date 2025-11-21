const fetchPlaylist = async () => {
        try {
            // Añadimos un timestamp para evitar caché del navegador, pero Google Sheets
            // a veces cachea en su servidor. Es normal.
            const response = await fetch(`${SHEET_CSV_URL}&uid=${Date.now()}`, {
                cache: "no-store",
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            
            const text = await response.text();

            // 🛡️ PROTECCIÓN ANTI-PARPADEO:
            // Si Google nos devuelve un HTML de error o algo muy corto, ABORTAMOS.
            // Así evitamos borrar la pizarra por error.
            if (!text || text.trim().startsWith("<!DOCTYPE") || text.length < 50) {
                console.warn("Google Sheets devolvió un error temporal, mantenemos la lista anterior.");
                setIsLoading(false); // Quitamos cargando por si era la primera vez
                return; // ⛔ SALIMOS sin tocar el estado 'playlist'
            }

            let remoteTracks = [];

            if (text && text.length > 10) {
                const rows = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').slice(1);
                const separator = text.indexOf(';') > -1 && text.indexOf(',') < text.indexOf(';') ? ';' : ',';

                remoteTracks = rows.map((row) => {
                    if (!row || row.trim() === "") return null;
                    // Regex para separar por comas/puntos y coma respetando comillas
                    const regex = new RegExp(`${separator}(?=(?:(?:[^"]*"){2})*[^"]*$)`);
                    const columns = row.split(regex); 
                    const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"').trim() : '';

                    // Ajusta estos índices [1], [2], [3] según el orden de tu CSV
                    const songName = clean(columns[1]);
                    const artistName = clean(columns[2]) || "Desconocido";
                    
                    // Generamos ID único
                    const uniqueId = `${songName}-${artistName}`.replace(/\s+/g, '-').toLowerCase();

                    return {
                        id: uniqueId, 
                        song: songName,
                        artist: artistName,
                        album: clean(columns[3]) || "Single",
                        isLocal: false
                    };
                }).filter(t => t && t.song && t.song.length > 0 && t.song !== "Canción desconocida").reverse();
            }

            // --- GESTIÓN DE LOCALES (Mantener lo que ya tenías) ---
            const localData = localStorage.getItem('dj_pending_tracks');
            let localTracks = localData ? JSON.parse(localData) : [];

            localTracks = localTracks.filter(local => {
                // Si la canción local YA aparece en la remota, la borramos de local
                // para que no salga duplicada.
                const alreadyInRemote = remoteTracks.some(remote => remote.id === local.id);
                return !alreadyInRemote; 
            });

            // Guardamos la limpieza en localStorage
            localStorage.setItem('dj_pending_tracks', JSON.stringify(localTracks));

            // Unimos: Locales primero (arriba), luego Remotas
            const finalPlaylist = [...localTracks.reverse(), ...remoteTracks];
            
            // Filtramos duplicados exactos de ID por seguridad
            const uniquePlaylist = finalPlaylist.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

            setPlaylist(uniquePlaylist);
            setIsLoading(false);

        } catch (error) {
            console.error("Error cargando:", error);
            // Si falla la red, NO ponemos isLoading(false) ni borramos la lista.
            // Dejamos lo que había.
        }
    };

    useEffect(() => {
        fetchPlaylist();
        // ⏱️ CAMBIO: Subimos a 10000ms (10 segundos) para no saturar a Google
        const interval = setInterval(fetchPlaylist, 10000);
        return () => clearInterval(interval);
    }, []);

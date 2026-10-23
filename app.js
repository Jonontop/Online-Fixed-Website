const iconPaths={
'arrow-down':'<path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/>',windows:'<path d="M3 4h7v7H3zm11 0h7v7h-7zM3 15h7v7H3zm11 0h7v7h-7z" fill="currentColor" stroke="none"/>',play:'<path d="m8 5 11 7-11 7z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',refresh:'<path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5"/>',pause:'<path d="M8 5v14M16 5v14"/>','check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',zap:'<path d="m13 2-9 12h7l-1 8 10-12h-8z"/>',radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 8-8"/><circle cx="12" cy="12" r="1"/>',wrench:'<path d="m14 7 3 3 4-4a6 6 0 0 1-8 8l-6 7-4-4 7-6a6 6 0 0 1 8-8z"/>',feather:'<path d="M20 4C15-1 5 8 7 15c7 2 16-8 13-11ZM3 21 16 8M7 15h7"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',x:'<path d="m6 6 12 12M6 18 18 6"/>'};
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.grid}</svg>`;
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon))}hydrateIcons();
const games=[{name:'Neon Drift',source:'Online-Fix',genre:'Racing · Co-op',art:'neon',display:'NEON<br>DRIFT'},{name:'Emberfall',source:'FitGirl',genre:'Action · Adventure',art:'ember',display:'EMBERFALL'},{name:'The Last Frontier',source:'Online-Fix',genre:'Survival · Multiplayer',art:'frontier',display:'THE LAST<br>FRONTIER'},{name:'Beyond the Horizon',source:'FitGirl',genre:'Open world · Adventure',art:'world',display:'BEYOND<br>THE HORIZON'},{name:'Echo Protocol',source:'Online-Fix',genre:'Sci-fi · Co-op',art:'echo',display:'ECHO<br>PROTOCOL'},{name:'Solstice',source:'FitGirl',genre:'Exploration · Single-player',art:'solstice',display:'SOLSTICE'}];
let currentFilter='All',currentView='library',paused=false,toastTimer;
const grid=document.querySelector('#game-grid'),search=document.querySelector('#game-search');
function toast(message){const el=document.querySelector('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),5000)}
function renderGames(){if(!grid)return;const q=search.value.trim().toLowerCase();const filtered=games.filter(g=>(currentFilter==='All'||g.source===currentFilter)&&g.name.toLowerCase().includes(q));grid.innerHTML=filtered.map(g=>`<button class="game-card" data-game="${g.name}" aria-label="Preview ${g.name}"><div class="game-art"><img src="assets/${g.art}.svg" width="400" height="260" loading="lazy" alt="Original illustrated ${g.genre.toLowerCase()} game artwork"><span class="source-tag ${g.source==='FitGirl'?'fitgirl':''}">${g.source}</span><span class="art-title">${g.display}</span></div><h3>${g.name}</h3><p><span>●</span> ${g.genre}</p></button>`).join('');grid.classList.toggle('expanded',currentView==='discover'||q.length>0||currentFilter!=='All');document.querySelector('#empty-state').hidden=filtered.length!==0;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===currentFilter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});}
function setView(view){currentView=view;const titles={library:['Your next adventure.','All your games, right where you left them.'],discover:['Find your next favorite.','Explore the complete illustrative catalog.'],downloads:['A little closer to play.','Manage your demo download queue.']};document.querySelector('#view-title').textContent=titles[view][0];document.querySelector('#view-description').textContent=titles[view][1];document.querySelector('#breadcrumb').textContent=view.toUpperCase();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));document.querySelector('.featured-game').hidden=view!=='library';grid.hidden=view==='downloads';document.querySelector('.library-controls').hidden=view==='downloads';document.querySelector('#empty-state').hidden=true;renderGames();if(view==='downloads')document.querySelector('#empty-state').hidden=true;}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filter;renderGames()}));document.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.source;setView('discover')}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));search?.addEventListener('input',renderGames);renderGames();
if(grid){const browse=document.createElement('button');browse.className='browse-all';browse.textContent='Explore all 6 games →';grid.after(browse);browse.addEventListener('click',()=>{currentFilter='All';search.value='';setView('discover');browse.hidden=true});document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>browse.hidden=b.dataset.view!=='library'))}
document.addEventListener('click',e=>{const game=e.target.closest('[data-game]');if(game)toast(`${game.dataset.game} — this is an interactive preview. Game launching will be available in the desktop app.`)});
document.querySelector('#pause-download')?.addEventListener('click',e=>{paused=!paused;const b=e.currentTarget;b.innerHTML=icon(paused?'play':'pause');b.setAttribute('aria-label',paused?'Resume demo download':'Pause demo download');document.querySelector('#download-status').textContent=paused?'Paused · 64%':'Downloading · 64%';document.querySelector('#download-speed').textContent=paused?'Resume whenever you’re ready':'24.8 MB/s · About 3 min left';document.querySelector('#download-progress').style.background=paused?'#53637d':'#1a75ff'});
document.querySelector('#sync-library')?.addEventListener('click',()=>{currentFilter='All';search.value='';setView('library');toast('Demo library refreshed. All 6 illustrative games are up to date.')});
const dialog=document.querySelector('#download-dialog');let previousFocus;
document.querySelectorAll('[data-download]').forEach(b=>b.addEventListener('click',()=>{previousFocus=b;dialog.showModal()}));document.querySelector('.close-dialog')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog?.addEventListener('close',()=>previousFocus?.focus());document.querySelector('.modal-explore')?.addEventListener('click',()=>{dialog.close();document.querySelector('#preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#sync-library').focus({preventScroll:true})});
const menu=document.querySelector('.menu-button');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.querySelector('.header nav').classList.toggle('open',open)});document.querySelectorAll('.header nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.header nav').classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();const locale=document.querySelector('#locale-display');if(locale){try{const detected=new Intl.Locale(navigator.language||'en');const region=detected.region;locale.textContent='English · '+(region?new Intl.DisplayNames(['en'],{type:'region'}).of(region):'Global');locale.title='Region detected locally from your browser. Site content is available in English.'}catch{locale.textContent='English · Global'}}

// Fetch latest release details generated by GitHub Actions
async function loadLatestRelease() {
    try {
        const response = await fetch('./latest-release.json');
        if (!response.ok) return; // Fallback to default state if json doesn't exist yet

        const release = await response.json();
        
        // Extract data
        const tagName = release.tag_name; // e.g., "v1.0.0"
        const releaseUrl = release.html_url;
        
        // Find the actual Windows installer asset if attached to the release
        let downloadUrl = releaseUrl;
        if (release.assets && release.assets.length > 0) {
            // Looks for an .exe or just takes the first asset
            const exeAsset = release.assets.find(asset => asset.name.endsWith('.exe')) || release.assets[0];
            downloadUrl = exeAsset.browser_download_url;
        }

        // Update the download modal or buttons dynamically
        const downloadModalTitle = document.querySelector('#download-dialog h2');
        const downloadModalText = document.querySelector('#download-dialog p');
        const releaseState = document.querySelector('.release-state');

        if (downloadModalTitle && releaseState) {
            downloadModalTitle.innerHTML = `Version ${tagName} is ready.`;
            downloadModalText.innerHTML = `The Windows installer for online-fixed version ${tagName} is now available.`;
            
            // Change the modal state indicator to active download button
            releaseState.innerHTML = `<span class="dot" style="background-color: #2ea44f;"></span> Available for Windows 10 / 11`;
            
            // Swap out modal explore/coming soon button with a real download link
            const modalBtn = document.querySelector('.modal-explore');
            if (modalBtn) {
                modalBtn.outerHTML = `<a href="${downloadUrl}" class="button" target="_blank" style="text-decoration: none; text-align: center; display: block; margin-top: 1rem;"><span data-icon="windows"></span> Download Installer (${tagName})</a>`;
            }
        }

        // Update header/hero buttons to point directly to the download instead of just opening the modal (optional)
        document.querySelectorAll('[data-download]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // If you still want the modal to open, let it open, but it now contains the live link!
            });
        });

    } catch (error) {
        console.log('No release JSON found yet, using default preview state.');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadLatestRelease);

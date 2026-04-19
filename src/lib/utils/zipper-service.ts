import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ZipAsset {
  url: string;
  filename: string;
}

export async function createProductionZip(
  videoTitle: string,
  textContent: string,
  assets: ZipAsset[]
): Promise<{ success: true } | { success: false; errorMessage: string }> {
  try {
    const zip = new JSZip();

    // 1. Injeta o documento principal formatado
    zip.file('1-Roteiro_Aprovado.txt', textContent);

    // 2. Fetch de todos os blobs de áudio/imagem paralelamente
    const promises = assets.map(async (asset) => {
      try {
        // Blobs nativos de URLs públicas do Supabase Storage
        const response = await fetch(asset.url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const blob = await response.blob();
        zip.file(`midias/${asset.filename}`, blob);
      } catch (err) {
        console.error(`[zipper-service] Falha limitante de conexão ao empacotar ${asset.filename}:`, err);
        // Resiliência de Erro no Empacotamento
        zip.file(`midias/FALHA_CONEXAO_${asset.filename}.txt`, `O motor zip não conseguiu buscar a mídia hospedada em: ${asset.url}\nLog: ${err}`);
      }
    });

    await Promise.all(promises);

    // 3. Compila tudo num blob na memória do navegador
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // 4. Invoca janela nativa de salvamento do SO
    const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'export_ad_labs';
    saveAs(zipBlob, `${safeTitle}.zip`);

    return { success: true };
  } catch (err) {
    console.error('[zipper-service] Erro fatal (memória/JSZip):', err);
    return { success: false, errorMessage: 'Falha ao compilar empacotamento na CPU local.' };
  }
}

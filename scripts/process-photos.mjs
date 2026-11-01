// Converts photos-src/* to WebP (640/1280/2000), strips EXIF/GPS, writes src/data/gallery.js
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const src='photos-src', out='public/img', sizes=[640,1280,2000];
fs.mkdirSync(out,{recursive:true});
const list=[];
for (const f of fs.readdirSync(src).filter(f=>/\.(jpe?g|png|webp)$/i.test(f)).sort()){
  const id=path.parse(f).name; const meta=await sharp(path.join(src,f)).metadata();
  // targets <= source width, plus the native width if it falls between targets (never upscale)
  const avail=[...new Set([...sizes.filter(w=>w<=meta.width),...(meta.width<sizes[sizes.length-1]&&!sizes.includes(meta.width)?[meta.width]:[])])].sort((a,b)=>a-b);
  for (const w of avail){
    await sharp(path.join(src,f)).rotate().resize({width:w,withoutEnlargement:true})
      .webp({quality:84}).toFile(path.join(out,`${id}-${w}.webp`)); // sharp strips EXIF/GPS by default
  }
  list.push({id,w:meta.width,h:meta.height,sizes:avail});
}
fs.writeFileSync('src/data/gallery.js','export const gallery = '+JSON.stringify(list,null,2)+';\n');
console.log(list.length,'photos processed');

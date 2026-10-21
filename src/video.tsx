import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Scene = {
  time: string;
  headline: string;
  lines: string[];
  place: string;
  emoji: string;
  bg: string;
  accent: string;
};

const scenes: Scene[] = [
  {time:'1 DETIK',headline:'SEMUA PRIA MENGHILANG',lines:['Dalam sekejap, miliaran orang lenyap.','Dunia langsung berubah.'],place:'SELURUH DUNIA',emoji:'⚡',bg:'#101827',accent:'#ff7a30'},
  {time:'1 MENIT',headline:'DUNIA TERKEJUT',lines:['Keluarga mencari orang terdekat.','Jalanan dipenuhi kebingungan.'],place:'RUMAH & JALANAN',emoji:'📱',bg:'#283c52',accent:'#ffcf5a'},
  {time:'1 JAM',headline:'BANYAK SISTEM TERGANGGU',lines:['Sejumlah pekerjaan mendadak kosong.','Layanan penting perlu diatur ulang.'],place:'RUMAH SAKIT & BANDARA',emoji:'🚨',bg:'#4c2530',accent:'#ff785f'},
  {time:'1 HARI',headline:'DUNIA MULAI BERADAPTASI',lines:['Perempuan mengambil banyak peran baru.','Komunitas saling membantu.'],place:'KOTA & DESA',emoji:'🤝',bg:'#1d514c',accent:'#6df0c2'},
  {time:'1 BULAN',headline:'TANTANGAN MAKIN BESAR',lines:['Rantai pasokan dan industri terdampak.','Masyarakat mencari cara baru.'],place:'PELABUHAN & PABRIK',emoji:'🏭',bg:'#35465b',accent:'#7ed6ff'},
  {time:'1 TAHUN',headline:'MASA DEPAN BERUBAH',lines:['Banyak hal bergantung pada teknologi.','Populasi manusia menghadapi krisis.'],place:'LABORATORIUM & BUMI',emoji:'🌍',bg:'#263b29',accent:'#b7ff7a'},
];

const clamp = (n:number, min:number, max:number) => Math.min(max, Math.max(min,n));

const SceneArt: React.FC<{scene: Scene; frame: number}> = ({scene, frame}) => {
  const drift = Math.sin(frame / 22) * 8;
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
      <div style={{
        position:'absolute',width:760,height:760,borderRadius:'50%',
        left:'50%',top:430,transform:`translateX(-50%) translateY(${drift}px)`,
        background:`radial-gradient(circle, ${scene.accent}55 0%, ${scene.accent}12 42%, transparent 70%)`,
      }}/>
      <div style={{position:'absolute',bottom:420,left:-80,right:-80,height:260,
        background:'linear-gradient(180deg, transparent, #070b12aa)',
      }}/>
      {Array.from({length:8},(_,i)=>(
        <div key={i} style={{
          position:'absolute',bottom:420,width:70+(i%3)*40,height:140+(i%4)*65,
          left:`${i*14-2}%`,background:'#07101d',borderTop:`5px solid ${scene.accent}88`,
          borderRadius:'6px 6px 0 0',
        }}>
          {Array.from({length:3},(_,j)=>(
            <div key={j} style={{height:8,width:12,background:scene.accent+'99',
              margin:'15px auto',opacity:(i+j)%2?0.35:0.8}}/>
          ))}
        </div>
      ))}
      <div style={{
        position:'absolute',top:510,left:0,right:0,textAlign:'center',
        fontSize:240,filter:'drop-shadow(0 18px 25px #0007)',
        transform:`translateY(${drift}px)`,
      }}>{scene.emoji}</div>
      <div style={{position:'absolute',bottom:390,left:0,right:0,textAlign:'center',
        color:'#ffffffa8',fontSize:22,fontWeight:800,letterSpacing:7}}>
        {scene.place}
      </div>
    </div>
  );
};

export const SemenitVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneDuration = 300; // 10 seconds per scene
  const sceneIndex = Math.min(scenes.length-1, Math.floor(frame/sceneDuration));
  const sceneFrame = frame % sceneDuration;
  const scene = scenes[sceneIndex];
  const enter = spring({frame:sceneFrame, fps, config:{damping:16, stiffness:100}});
  const fade = interpolate(sceneFrame,[0,12,sceneDuration-12,sceneDuration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const seconds = Math.floor(frame/fps);
  const remaining = 60-seconds;
  const progress = frame/1799;
  const pulse = 1 + Math.sin(frame/5)*0.035;

  return (
    <AbsoluteFill style={{background:scene.bg,color:'white',fontFamily:'Arial, Helvetica, sans-serif'}}>
      <SceneArt scene={scene} frame={frame}/>
      <AbsoluteFill style={{padding:'78px 72px 90px',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:30,fontWeight:1000,letterSpacing:5}}>SEMENIT<span style={{color:'#ff7a30'}}>.</span></div>
          <div style={{border:'2px solid #ffffff66',borderRadius:30,padding:'12px 20px',
            background:'#0005',fontSize:24,fontWeight:800,fontVariantNumeric:'tabular-nums'}}>
            00:{String(remaining).padStart(2,'0')}
          </div>
        </div>

        <div style={{position:'absolute',top:270,left:72,right:72,opacity:fade,
          transform:`translateY(${(1-enter)*35}px)`}}>
          <div style={{fontSize:27,fontWeight:900,letterSpacing:5,color:scene.accent,marginBottom:22}}>
            {scene.time}
          </div>
          <div style={{fontSize:65,fontWeight:1000,lineHeight:1.05,letterSpacing:-1,
            textShadow:'0 5px 20px #0006'}}>
            {scene.headline}
          </div>
        </div>

        <div style={{position:'absolute',left:72,right:72,bottom:175,
          background:'#080d17dd',border:`2px solid ${scene.accent}99`,
          borderRadius:28,padding:'30px 32px',opacity:fade,
          transform:`scale(${0.96+enter*0.04})`}}>
          {scene.lines.map((line,i)=>(
            <div key={line} style={{display:'flex',gap:16,alignItems:'flex-start',
              fontSize:31,fontWeight:700,lineHeight:1.25,marginBottom:i===0?16:0}}>
              <span style={{color:scene.accent}}>●</span><span>{line}</span>
            </div>
          ))}
        </div>

        <div style={{position:'absolute',left:72,right:72,bottom:78}}>
          <div style={{height:8,background:'#ffffff35',borderRadius:10,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress*100}%`,background:'#ff7a30',borderRadius:10}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:14,
            color:'#ffffffb8',fontSize:20,fontWeight:700,letterSpacing:2}}>
            <span>APA YANG TERJADI?</span><span>{Math.min(60,seconds)} / 60 DETIK</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

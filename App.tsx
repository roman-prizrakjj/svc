import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment, Float, Sparkles, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion';
import { 
  Terminal, Cpu, ShieldAlert, Lock, 
  Zap, Activity, ChevronDown, Copy, 
  CheckCircle, Rocket, TrendingUp, Code,
  Users, Database, Globe
} from 'lucide-react';

// --- 1. CONTENT & TRANSLATIONS ---

type ContentType = {
  status: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  subtitleHighlight: string;
  btnGet: string;
  btnCopy: string;
  btnCopied: string;
  logs: { time: string; msg: string; color?: string }[];
  narrative: {
    title: string;
    subtitle: string;
    desc: string;
    list: string[];
  };
  utility: {
    label: string;
    title: string;
    titleHighlight: string;
    desc: string;
    cards: { title: string; text: string }[];
  };
  growth: {
    title: string;
    items: { title: string; text: string }[];
    boxTitle: string;
    boxSub: string;
  };
  roadmap: {
    title: string;
    items: { phase: string; title: string; status: 'done' | 'active' | 'pending'; list: string[] }[];
  };
  liquidityPool: {
    title: string;
    subtitle: string;
    codeLines: string[];
    finalMessage: string;
  };
  cta: {
    title: string;
    titleHighlight: string;
    desc: string;
    sub: string;
    btnChat: string;
  };
  footer: {
    rights: string;
    sub: string;
  };
};

const CONTENT: { ru: ContentType; en: ContentType } = {
  ru: {
    status: "Система в норме",
    titleLine1: "SAFE VIBE",
    titleLine2: "CODE",
    subtitle: "Официальный технический токен AI-комьюнити.",
    subtitleHighlight: "Без мемов. Только код. Только польза.",
    btnGet: "КУПИТЬ SVC",
    btnCopy: "КОПИРОВАТЬ CA",
    btnCopied: "СКОПИРОВАНО!",
    logs: [
      { time: "ЗАГРУЗКА", msg: "Подключение к SVC Mainnet...", color: "text-neon" },
      { time: "ЛОГ_001", msg: "Откуп дева: 1500 TON подтверждено.", color: "text-white" },
      { time: "ЛОГ_002", msg: "Поиск флипперов... [УДАЛЕНО]", color: "text-red-400" },
      { time: "ЛОГ_003", msg: "Поддержка на уровне 6k-8k.", color: "text-green-400" },
      { time: "СТАТУС", msg: "Команда держит ~40%. Фонд заблокирован.", color: "text-yellow-400" },
      { time: "ИНФО", msg: "Стек Дева: Python, Rust, Go. 10+ лет опыта.", color: "text-gray-500" },
      { time: "СИСТЕМА", msg: "Старт с нулевой ликвидности. Рыночная цена.", color: "text-blue-400" },
    ],
    narrative: {
      title: "ОСНОВА",
      subtitle: "Фундамент на коде.",
      desc: "Мы не запускали мем. Мы запустили экосистему. Лидеры сообщества — это предприниматели и разработчики в разных сферах AI интеграций.",
      list: [
        "Старт с нулевой ликвидности: Честный запуск.",
        "Реальный откуп: Монета откупалась по рыночной стоимости членами сообщества, совокупно более 1500+ TON.",
        "Анти-Флиппер: 40% заблокировано для защиты."
      ]
    },
    utility: {
      label: "ПРИМЕНЕНИЕ",
      title: "РЕАЛЬНАЯ",
      titleHighlight: "ПОЛЬЗА",
      desc: "Код — это закон. Токен — топливо для сообщества инженеров.",
      cards: [
        { title: "Оплата разработок", text: "Все продукты и сервисы покупаются исключительно за SVC." },
        { title: "Взаиморасчёты", text: "Внутренние платежи и награды для участников сообщества." },
        { title: "Инвестиции", text: "Прозрачный инструмент для инвестиций в R&D проекты." },
        { title: "Ликвидность", text: "Цена токена привязана к реальным продуктам." }
      ]
    },
    growth: {
      title: "Почему мы растем.",
      items: [
        { title: "AI Компетенции", text: "Самый динамичный сектор рынка. SVC привязан к росту продуктов." },
        { title: "Реальная Экономика", text: "Нет «фейкового объема». Токен нужен для реальных услуг." },
        { title: "Честный Старт", text: "Мы начали с нуля. Это обеспечивает органический поиск цены." }
      ],
      boxTitle: "AI + R&D",
      boxSub: "Вектор Роста"
    },
    roadmap: {
      title: "ДОРОЖНАЯ КАРТА",
      items: [
        { phase: "ФАЗА 1", title: "Запуск и База", status: "done", list: ["Создание токена", "Запуск комьюнити", "Первичное распределение", "Выход на DEX-биржи", "Экономическая модель"] },
        { phase: "ФАЗА 2", title: "Интеграция (Сейчас)", status: "active", list: ["SVC для оплаты", "Создание пула ликвидности", "Система расчетов", "Первые продукты", "Планирование дивидендной системы для холдеров", "Инвестиции в R&D"] },
        { phase: "ФАЗА 3", title: "Рост Ликвидности", status: "pending", list: ["Расширение линейки", "Рост оборота", "Стабильный спрос", "Вход маркетмейкера"] },
        { phase: "ФАЗА 4", title: "Масштабирование", status: "pending", list: ["Листинг на других DEX", "Масштабирование экосистемы", "Внешние инвесторы", "Долгосрочный рост"] }
      ]
    },
    liquidityPool: {
      title: "ПУЛ ЛИКВИДНОСТИ",
      subtitle: "Система находится в активной разработке",
      codeLines: [
        "// Инициализация контракта пула ликвидности",
        "contract LiquidityPool {",
        "  mapping(address => uint256) public balances;",
        "  uint256 public totalLiquidity;",
        "  ",
        "  function addLiquidity(uint256 amount) external {",
        "    require(amount > 0, 'Invalid amount');",
        "    balances[msg.sender] += amount;",
        "    totalLiquidity += amount;",
        "  }",
        "}",
        "",
        "// Компиляция смарт-контракта...",
        "✓ Синтаксис проверен",
        "✓ Оптимизация газа",
        "✓ Аудит безопасности",
        "",
      ],
      finalMessage: "[ В РАЗРАБОТКЕ ]"
    },
    cta: {
      title: "ГОТОВЫ",
      titleHighlight: "СТРОИТЬ?",
      desc: "Присоединяйтесь к техническому комьюнити. Получите доступ к экосистеме.",
      sub: "Старт с нулевой ликвидности. 100% Органика.",
      btnChat: "Крипто Чат"
    },
    footer: {
      rights: "SafeVibeCode © 2025. Все системы в норме.",
      sub: "Управляется сообществом. Основано на коде."
    }
  },
  en: {
    status: "System Operational",
    titleLine1: "SAFE VIBE",
    titleLine2: "CODE",
    subtitle: "Official Technical Utility Token of the AI Community.",
    subtitleHighlight: "No meme. Just Code. Just Utility.",
    btnGet: "GET SVC TOKEN",
    btnCopy: "COPY CA",
    btnCopied: "COPIED!",
    logs: [
      { time: "INITIALIZING", msg: "Connecting to SVC Mainnet...", color: "text-neon" },
      { time: "LOG_001", msg: "Dev buyback initiated: 1500 TON confirmed.", color: "text-white" },
      { time: "LOG_002", msg: "Scanning for flippers... [REMOVED]", color: "text-red-400" },
      { time: "LOG_003", msg: "Support level secured at 6k-8k.", color: "text-green-400" },
      { time: "STATUS", msg: "Team holds ~40% supply. Foundation Locked.", color: "text-yellow-400" },
      { time: "INFO", msg: "Dev Stack: Python, Rust, Go. 10+ YOE.", color: "text-gray-500" },
      { time: "SYS_MSG", msg: "Zero Liquidity Start. Pure Market Price.", color: "text-blue-400" },
    ],
    narrative: {
      title: "NOT A FLIP.",
      subtitle: "Foundations Built on Code.",
      desc: "We didn't launch a meme. We launched an ecosystem. Community leaders are entrepreneurs and developers in various AI integration fields.",
      list: [
        "Zero Liquidity Start: Fair launch, no dumping.",
        "Real Buyback: The token was bought back at market price by community members, collectively over 1500+ TON.",
        "Anti-Flipper: 40% Supply Locked for protection."
      ]
    },
    utility: {
      label: "USE CASE",
      title: "REAL",
      titleHighlight: "UTILITY",
      desc: "Code is law. The token is the fuel for the AI engineering community.",
      cards: [
        { title: "Dev Payment", text: "All products, services, and tools built by the community are purchased exclusively with SVC." },
        { title: "Settlements", text: "Internal payments, rewards, and bounties for community members and contractors." },
        { title: "Investment", text: "A transparent instrument for investing in R&D projects. Real backing by real development." },
        { title: "Liquidity", text: "Token value is pegged to real community products and processes, not just hype." }
      ]
    },
    growth: {
      title: "Why We Grow.",
      items: [
        { title: "AI Competencies", text: "We operate in the most dynamic market sector. SVC is pegged to AI product growth." },
        { title: "Real Economy", text: "No 'Fake Volume'. The token is used for actual services. The demand is driven by utility." },
        { title: "Zero Liquidity Launch", text: "We started from 0. This ensures price discovery is organic and resistant to manipulation." }
      ],
      boxTitle: "AI + R&D",
      boxSub: "Primary Growth Vector"
    },
    roadmap: {
      title: "ROADMAP",
      items: [
        { phase: "PHASE 1", title: "Launch & Base", status: "done", list: ["Token Creation", "Community Launch", "Primary Distribution", "Launch on DEX Exchanges", "Economic Model Formation"] },
        { phase: "PHASE 2", title: "Integration (Current)", status: "active", list: ["SVC for Dev Payments", "Liquidity Pool Creation", "Internal Settlement System", "First Products Live", "Dividend System Planning for Holders", "Initial R&D Investment"] },
        { phase: "PHASE 3", title: "Liquidity Growth", status: "pending", list: ["Product Line Expansion", "Increased Token Velocity", "Stable Demand Formation", "Market Maker Entry"] },
        { phase: "PHASE 4", title: "Market Expansion", status: "pending", list: ["Other DEX Listings", "Ecosystem Scaling", "External Investors", "Long-term Growth"] }
      ]
    },
    liquidityPool: {
      title: "LIQUIDITY POOL",
      subtitle: "System under active development",
      codeLines: [
        "// Initializing Liquidity Pool Contract",
        "contract LiquidityPool {",
        "  mapping(address => uint256) public balances;",
        "  uint256 public totalLiquidity;",
        "  ",
        "  function addLiquidity(uint256 amount) external {",
        "    require(amount > 0, 'Invalid amount');",
        "    balances[msg.sender] += amount;",
        "    totalLiquidity += amount;",
        "  }",
        "}",
        "",
        "// Compiling smart contract...",
        "✓ Syntax validated",
        "✓ Gas optimization complete",
        "✓ Security audit passed",
        "",
      ],
      finalMessage: "[ IN DEVELOPMENT ]"
    },
    cta: {
      title: "READY TO",
      titleHighlight: "BUILD?",
      desc: "Join the technical community. Get access to the ecosystem.",
      sub: "Zero Liquidity Start. 100% Organic.",
      btnChat: "Crypto Chat"
    },
    footer: {
      rights: "SafeVibeCode © 2025. All systems operational.",
      sub: "Community Driven. Code Based."
    }
  }
};

// --- 2. CUSTOM SHADER (THE VIBE CORE) ---
const DataFlowShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ff88') },
    uIntensity: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vNormal = normal;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPos;

    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    void main() {
      // Hexagon Grid pattern
      vec2 r = vUv * 10.0;
      vec2 f = fract(r);
      float hex = step(0.1, abs(sin(r.x * 3.0) + cos(r.y * 3.0)));

      // Data scanlines
      float scan = step(0.8, sin(vUv.y * 40.0 - uTime * 3.0));
      
      // Glitch noise
      float glitch = step(0.98, random(vec2(floor(vUv.y * 20.0), floor(uTime * 5.0))));
      
      vec3 finalColor = uColor * (hex * 0.1 + scan * 0.3 + glitch * uIntensity);
      
      // Fresnel Rim Lighting for 3D depth
      float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.5);
      
      gl_FragColor = vec4(finalColor + (fresnel * uColor * 1.5), 0.9);
    }
  `
};

// --- 3. 3D SCENE COMPONENTS ---

const TheCore = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const scrollVal = scrollProgress.get();
      materialRef.current.uniforms.uIntensity.value = 1.0 + scrollVal * 8.0;
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#00ff88') }, uIntensity: { value: 1.0 } },
    vertexShader: DataFlowShader.vertexShader,
    fragmentShader: DataFlowShader.fragmentShader
  }), []);

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <RoundedBox ref={meshRef} args={[2.8, 2.8, 2.8]} radius={0.3} smoothness={4}>
        <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.9} />
        <mesh scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[2.8, 2.8, 2.8]} />
          <shaderMaterial ref={materialRef} args={[shaderArgs]} transparent={true} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </RoundedBox>
    </Float>
  );
};

const SceneController = ({ scrollY }: { scrollY: MotionValue<number> }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    const scroll = scrollY.get();
    const targetY = THREE.MathUtils.lerp(0, -10, scroll);
    const targetZ = THREE.MathUtils.lerp(6, 12, scroll);
    
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

// New Component for the filled area chart under the curve
const GraphArea = ({ curve }: { curve: THREE.Curve<THREE.Vector3> }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    
    const geometry = useMemo(() => {
      const points = curve.getPoints(100);
      const vertices: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      const minY = -2; // Must match the Grid height or slightly below
  
      points.forEach((p, i) => {
        // Top vertex (on the curve)
        vertices.push(p.x, p.y, p.z);
        // UV Y=1 is top
        uvs.push(i / (points.length - 1), 1);
        
        // Bottom vertex (at base level)
        vertices.push(p.x, minY, p.z);
        // UV Y=0 is bottom
        uvs.push(i / (points.length - 1), 0);
      });
  
      // Create triangles (2 per segment)
      for (let i = 0; i < points.length - 1; i++) {
        const tl = i * 2;     // Top Left
        const bl = i * 2 + 1; // Bottom Left
        const tr = (i + 1) * 2; // Top Right
        const br = (i + 1) * 2 + 1; // Bottom Right
        
        // Triangle 1
        indices.push(tl, bl, tr);
        // Triangle 2
        indices.push(bl, br, tr);
      }
  
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return geom;
    }, [curve]);
  
    return (
      <mesh geometry={geometry}>
        <shaderMaterial 
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          uniforms={{
             color: { value: new THREE.Color('#00ff88') },
             opacityTop: { value: 0.5 },
             opacityBottom: { value: 0.0 }
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float opacityTop;
            uniform float opacityBottom;
            varying vec2 vUv;
            void main() {
              // Gradient alpha from bottom (0) to top (1)
              float alpha = mix(opacityBottom, opacityTop, vUv.y);
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </mesh>
    );
};

const GrowthScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const scaleX = viewport.aspect < 1 ? 1.25 : 1.5;
  
  // Curve definition: Volatility + Growth
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-3, -1.1, 0.1),    // Start Low
      new THREE.Vector3(-1.5, -0.5, 0.2),  // Initial Rise
      new THREE.Vector3(-0.5, -0.1, 0.3),  // The "Risk" Dip
      new THREE.Vector3(0.5, 0, 0.4),    // Recovery
      new THREE.Vector3(1.5, 0.5, 0.5),   // Stabilization/Minor Dip
      new THREE.Vector3(3, 1.0, 0.9)       // Final Organic Growth
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating of the whole chart
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <>
      <group ref={groupRef} scale={[scaleX, 1, 1]}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
            
            {/* The Sharp Graph Line */}
            <Line 
                points={curve.getPoints(100)} 
                color="#00ff88" 
                lineWidth={2} 
                transparent 
                opacity={1}
            />

            {/* The Gradient Fill Area */}
            <GraphArea curve={curve} />

            {/* Grid Floor for context */}
            <Grid 
                position={[0, -2, 0]} 
                args={[10, 10]} 
                cellSize={0.5} 
                cellThickness={0.5} 
                cellColor="#1f2937" 
                sectionSize={2} 
                sectionThickness={1} 
                sectionColor="#00ff88" 
                fadeDistance={15} 
                fadeStrength={1} 
                infiniteGrid={true}
            />
            
            {/* Particles representing data points/trades */}
            <Sparkles count={20} scale={[6, 4, 1]} size={3} speed={0.4} opacity={0.5} color="#ffffff" />
        </Float>
      </group>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
    </>
  );
};

const GrowthVisual = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
            <GrowthScene />
            <Environment preset="city" />
        </Canvas>
    </div>
  );
};

// --- 4. UI COMPONENTS ---

const Section = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <section className={`min-h-screen w-full flex flex-col justify-center relative z-10 px-4 md:px-8 py-20 ${className}`}>
    {children}
  </section>
);

const GlitchText = ({ text, size = "text-4xl" }: { text: string; size?: string }) => (
  <div className="relative inline-block">
    <h2 className={`${size} font-bold font-mono text-white relative z-10`}>{text}</h2>
    <h2 className={`${size} font-bold font-mono text-neon absolute top-0 left-[2px] -z-10 opacity-70 animate-pulse`}>{text}</h2>
    <h2 className={`${size} font-bold font-mono text-blue-500 absolute top-0 -left-[2px] -z-10 opacity-70 animate-bounce`}>{text}</h2>
  </div>
);

const TerminalWindow = ({ logs }: { logs: { time: string; msg: string; color?: string }[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="w-full bg-black/90 border border-neon/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.05)] font-mono text-sm"
    >
      <div className="bg-gray-900/80 px-4 py-2 border-b border-white/10 flex gap-2 items-center">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
        <span className="ml-4 text-xs text-gray-500">root@svc-mainnet:~/logs</span>
      </div>
      <div className="p-6 space-y-2 max-h-[400px] overflow-y-auto">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15 }}
            className="border-l border-gray-800 pl-3"
          >
            <span className="text-gray-500 text-xs mr-3">[{log.time}]</span>
            <span className={log.color || "text-gray-300"}>{log.msg}</span>
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }} 
          className="text-neon mt-2"
        >
          _
        </motion.div>
      </div>
    </motion.div>
  );
};

const GlassCard = ({ icon: Icon, title, children }: { icon: any, title: string, children?: React.ReactNode }) => (
  <div className="bg-glass hover:bg-glass-high border border-white/10 hover:border-neon/40 p-6 md:p-8 rounded-xl backdrop-blur-md transition-all duration-300 group h-full">
    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-neon mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold font-mono mb-3 text-white group-hover:text-neon transition-colors">{title}</h3>
    <div className="text-white text-sm leading-relaxed">{children}</div>
  </div>
);

const LiquidityPoolCode = ({ lines, finalMessage }: { lines: string[], finalMessage: string }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    // Reset and restart cycle
    if (currentLineIndex >= lines.length) {
      setShowFinalMessage(true);
      const resetTimer = setTimeout(() => {
        setShowFinalMessage(false);
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 2000); // Show final message for 2 seconds
      return () => clearTimeout(resetTimer);
    }

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (!newLines[currentLineIndex]) newLines[currentLineIndex] = '';
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 20); // Typing speed
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 50); // Delay between lines
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines]);

  const renderLine = (line: string | undefined) => {
    if (!line) return <span>&nbsp;</span>;
    if (line.startsWith('//')) return <span className="text-gray-500">{line}</span>;
    if (line.startsWith('✓')) return <span className="text-green-400">{line}</span>;
    if (line.includes('contract') || line.includes('function') || line.includes('mapping')) {
      return <span className="text-blue-400">{line}</span>;
    }
    if (line.includes('require') || line.includes('external') || line.includes('public')) {
      return <span className="text-purple-400">{line}</span>;
    }
    if (line.trim() === '') return <span>&nbsp;</span>;
    return <span className="text-white">{line}</span>;
  };

  return (
    <div className="space-y-1">
      {displayedLines.length === 0 && (
        <div className="flex items-center gap-2 text-gray-500">
          <Code size={16} className="animate-pulse" />
          <span className="text-sm">Initializing compilation...</span>
        </div>
      )}
      
      {displayedLines.map((line, i) => line ? (
        <div key={i} className="leading-relaxed">
          {renderLine(line)}
        </div>
      ) : null)}
      
      {!showFinalMessage && currentLineIndex < lines.length && (
        <span className="inline-block w-2 h-4 bg-neon animate-pulse ml-1" />
      )}

      {showFinalMessage && (
        <div className="mt-8 flex items-center justify-center animate-[fadeIn_0.5s_ease-in]">
          <div className="px-8 py-4 bg-gradient-to-r from-neon/20 to-blue-500/20 border-2 border-neon/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Code className="text-neon animate-pulse" size={24} />
              <span className="text-2xl font-bold font-mono text-white tracking-wider">
                {finalMessage}
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadmapItem = ({ phase, title, status, items }: { phase: string, title: string, status: 'done' | 'active' | 'pending', items: string[] }) => {
    const statusColors = {
        done: "text-neon border-neon",
        active: "text-blue-400 border-blue-400",
        pending: "text-gray-500 border-gray-700"
    };

    return (
        <div className={`relative pl-8 pb-12 border-l-2 ${status === 'pending' ? 'border-gray-800' : 'border-neon/30'} last:border-0`}>
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-dark border-2 ${statusColors[status].split(' ')[1]} z-10`} />
            <div className="bg-black/80 border border-white/10 p-6 rounded-lg backdrop-blur-md hover:border-white/30 hover:bg-black/90 transition-all shadow-xl">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold font-mono uppercase px-2 py-1 rounded bg-black/60 border border-white/10 ${statusColors[status].split(' ')[0]}`}>
                        {phase} {status === 'active' && <span className="animate-pulse ml-1">●</span>}
                    </span>
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">{title}</h4>
                <ul className="space-y-2">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white">
                            <span className="text-neon mt-1 flex-shrink-0">›</span> 
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// --- 5. MAIN APPLICATION ---

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });
  
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const t = CONTENT[lang];

  const toggleLang = () => setLang(prev => prev === 'ru' ? 'en' : 'ru');

  const copyCA = () => {
    navigator.clipboard.writeText("EQBLwAPmuN_gNJSbISUXVKMOJgVXapdA459OxLPT-pjq_esM");
    const btn = document.getElementById("copy-btn");
    if(btn) {
        const originalText = btn.innerText;
        btn.innerText = t.btnCopied;
        setTimeout(() => btn.innerText = originalText, 2000);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-dark text-white selection:bg-neon selection:text-black">
      
      {/* LANGUAGE SWITCHER */}
      <button 
        onClick={toggleLang} 
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-lg border border-white/20 rounded-full font-mono text-xs hover:bg-neon/10 hover:border-neon/50 transition-all"
      >
        <Globe size={14} className={lang === 'ru' ? 'text-neon' : 'text-blue-400'} />
        <span className={lang === 'ru' ? 'text-white font-bold' : 'text-gray-400'}>RU</span>
        <span className="text-gray-600">/</span>
        <span className={lang === 'en' ? 'text-white font-bold' : 'text-gray-400'}>EN</span>
      </button>

      {/* FIXED 3D BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 35 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ff88" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
          <Environment preset="night" />
          <Sparkles count={100} scale={12} size={2} speed={0.2} opacity={0.2} color="#ffffff" />
          <TheCore scrollProgress={smoothScroll} />
          <SceneController scrollY={smoothScroll} />
        </Canvas>
        {/* OVERLAY FOR READABILITY */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <main className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <Section className="items-center text-center min-h-[100vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
             {/* VIDEO LOGO PLACEMENT */}
            <motion.div
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(0,255,136,0.2)] mb-8 relative z-20 bg-black/50"
            >
              <video
                src="/coin.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/20 bg-neon/5 backdrop-blur-md mb-6">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span className="text-neon text-xs font-mono uppercase tracking-[0.2em]">{t.status}</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 mix-blend-overlay">
              {t.titleLine1}
            </h1>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
              {t.titleLine2}
            </h1>
            
            <p className="text-white font-mono text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              {t.subtitle}
              <br/>
              <span className="text-white">{t.subtitleHighlight}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
              <button onClick={() => setIsBuyModalOpen(true)} className="flex-1 group relative px-8 py-4 bg-neon text-black font-bold font-mono overflow-hidden rounded hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all">
                <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {t.btnGet} <Rocket size={18} />
                </span>
              </button>
              <button id="copy-btn" onClick={copyCA} className="flex-1 px-8 py-4 border border-white/20 backdrop-blur-md rounded font-mono text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
                <Copy size={16} /> {t.btnCopy}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-10"
          >
            <ChevronDown size={32} />
          </motion.div>
        </Section>

        {/* --- NARRATIVE / ORIGIN --- */}
        <Section>
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto w-full">
            <div className="order-2 md:order-1">
                <TerminalWindow logs={t.logs} />
            </div>
            <div className="order-1 md:order-2">
                <GlitchText text={t.narrative.title} size="text-5xl md:text-7xl" />
                <h3 className="text-2xl font-bold text-white mt-6 mb-6">{t.narrative.subtitle}</h3>
                <p className="text-white text-lg mb-6 leading-relaxed">
                    {t.narrative.desc}
                </p>
                <ul className="space-y-4 font-mono text-sm text-white">
                    {t.narrative.list.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="text-neon" size={18} />
                          <span>{item}</span>
                      </li>
                    ))}
                </ul>
            </div>
          </div>
        </Section>

        {/* --- UTILITY SECTION --- */}
        <Section className="bg-black/20 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto w-full">
                <div className="mb-16 md:text-center">
                    <span className="text-neon font-mono text-sm tracking-widest uppercase mb-2 block">{t.utility.label}</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white">{t.utility.title} <span className="text-neon">{t.utility.titleHighlight}</span></h2>
                    <p className="text-white mt-4 max-w-2xl mx-auto">{t.utility.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <GlassCard icon={Code} title={t.utility.cards[0].title}>
                        {t.utility.cards[0].text}
                    </GlassCard>
                    <GlassCard icon={Users} title={t.utility.cards[1].title}>
                        {t.utility.cards[1].text}
                    </GlassCard>
                    <GlassCard icon={TrendingUp} title={t.utility.cards[2].title}>
                        {t.utility.cards[2].text}
                    </GlassCard>
                    <GlassCard icon={Database} title={t.utility.cards[3].title}>
                        {t.utility.cards[3].text}
                    </GlassCard>
                </div>
            </div>
        </Section>

        {/* --- WHY IT WILL GROW --- */}
        <Section>
            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:flex-1">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">{t.growth.title}</h2>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.growth.items[0].title}</h3>
                                <p className="text-white">{t.growth.items[0].text}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center text-neon shrink-0">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.growth.items[1].title}</h3>
                                <p className="text-white">{t.growth.items[1].text}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.growth.items[2].title}</h3>
                                <p className="text-white">{t.growth.items[2].text}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Decor for Growth */}
                <div className="w-full md:flex-1 relative h-[260px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/50 group">
                    {/* 3D Background Component */}
                    <GrowthVisual />
                    
                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center pb-10 pointer-events-none">
                        <div className="text-center relative z-10">
                             <div className="text-6xl font-mono font-bold text-neon mb-2 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                                {t.growth.boxTitle}
                             </div>
                             <div className="text-white uppercase tracking-widest text-sm font-bold">
                                {t.growth.boxSub}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>

        {/* --- ROADMAP --- */}
        <Section className="items-center">
             <div className="max-w-3xl mx-auto w-full">
                <h2 className="text-4xl font-black text-center mb-16">{t.roadmap.title}</h2>
                
                <div className="space-y-0">
                    {t.roadmap.items.map((item, i) => (
                      <RoadmapItem 
                          key={i}
                          phase={item.phase} 
                          title={item.title} 
                          status={item.status} 
                          items={item.list} 
                      />
                    ))}
                </div>
             </div>
        </Section>

        {/* --- LIQUIDITY POOL --- */}
        <Section className="items-center">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-black mb-3">
                  <span className="text-neon">{t.liquidityPool.title}</span>
                </h2>
                <p className="text-white font-mono text-sm">{t.liquidityPool.subtitle}</p>
              </div>

              {/* Code Compilation Block */}
              <div className="relative bg-black/90 border border-neon/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-neon/10 to-transparent border-b border-neon/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-gray-500 font-mono text-xs ml-2">liquidity_pool.sol</span>
                </div>

                {/* Code Content with Typewriter Effect */}
                <div className="p-6 pb-8 font-mono text-sm h-[520px] overflow-hidden">
                  <LiquidityPoolCode lines={t.liquidityPool.codeLines} finalMessage={t.liquidityPool.finalMessage} />
                </div>

                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* --- CTA / FOOTER --- */}
        <Section className="text-center !min-h-[70vh] justify-end pb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 bg-gradient-to-b from-gray-900 to-black border border-neon/20 p-10 md:p-20 rounded-3xl backdrop-blur-xl shadow-[0_0_100px_rgba(0,255,136,0.05)]"
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-8">
              {t.cta.title} <span className="text-neon">{t.cta.titleHighlight}</span>
            </h2>
            <p className="text-white mb-10 max-w-2xl mx-auto">
                {t.cta.desc}
                <br />
                <span className="text-white font-mono text-sm mt-2 block">{t.cta.sub}</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
               <button onClick={() => setIsBuyModalOpen(true)} className="flex items-center justify-center gap-3 px-6 py-4 bg-neon text-black font-bold hover:bg-neon/90 rounded-lg transition">
                  <Zap size={20} />
                  <span>{t.btnGet}</span>
               </button>
               <a href="https://t.me/SafeVibeCode_SVC" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition">
                  <Activity size={20} className="text-blue-400" />
                  <span>{t.cta.btnChat}</span>
               </a>
               <a href="#" className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition">
                  <Terminal size={20} className="text-white" />
                  <span>Whitepaper</span>
               </a>
            </div>

            <div className="text-gray-600 font-mono text-xs break-all">
              CA: EQBLwAPmuN_gNJSbISUXVKMOJgVXapdA459OxLPT-pjq_esM
            </div>
          </motion.div>

          <footer className="w-full pt-12 text-gray-700 text-xs font-mono flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <span>{t.footer.rights}</span>
            <span className="mt-2 md:mt-0">{t.footer.sub}</span>
          </footer>
        </Section>
      </main>

      {/* BUY MODAL */}
      {isBuyModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsBuyModalOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-md w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-neon/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon/20 via-transparent to-blue-500/20 opacity-50 pointer-events-none" />
            
            {/* Close button */}
            <button 
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all group"
            >
              <span className="text-white text-xl leading-none group-hover:rotate-90 transition-transform duration-300">×</span>
            </button>

            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-neon animate-pulse" />
                <h3 className="text-2xl font-bold font-mono text-white">
                  {lang === 'ru' ? 'КУПИТЬ SVC' : 'BUY SVC'}
                </h3>
              </div>
              <p className="text-white text-sm font-mono">
                {lang === 'ru' ? 'Выберите платформу для покупки' : 'Choose a platform to buy'}
              </p>
            </div>

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* DexScreener */}
              <a
                href="https://dexscreener.com/ton/eqatx0q5bypftuoatky619w2ptngoeablfkdfiqd2p1bdz5l"
                target="_blank"
                rel="noreferrer"
                className="group relative block p-5 bg-gradient-to-r from-neon/10 to-transparent hover:from-neon/20 border border-neon/30 hover:border-neon rounded-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon/0 via-neon/10 to-neon/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-neon/20 border border-neon/40 flex items-center justify-center">
                      <TrendingUp className="text-neon" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-mono text-lg">DexScreener</h4>
                      <p className="text-white text-xs font-mono">
                        {lang === 'ru' ? 'Анализ и обмен' : 'Analytics & Swap'}
                      </p>
                    </div>
                  </div>
                  <Rocket className="text-neon group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </div>
              </a>

              {/* Blum */}
              <a
                href="https://t.me/blum/app?startapp=memepadjetton_SVC_iQSVW-ref_15wKs2ipdg"
                target="_blank"
                rel="noreferrer"
                className="group relative block p-5 bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 border border-blue-500/30 hover:border-blue-500 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <Zap className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-mono text-lg">Blum</h4>
                      <p className="text-white text-xs font-mono">
                        {lang === 'ru' ? 'Telegram мини-приложение' : 'Telegram Mini App'}
                      </p>
                    </div>
                  </div>
                  <Rocket className="text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </div>
              </a>

              {/* Info text */}
              <div className="pt-2 text-center">
                <p className="text-gray-500 text-xs font-mono">
                  {lang === 'ru' ? 'Всегда проверяйте адрес контракта' : 'Always verify the contract address'}
                </p>
                <div className="mt-2 px-3 py-2 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-gray-400 break-all">
                  EQBLwAPmuN_gNJSbISUXVKMOJgVXapdA459OxLPT-pjq_esM
                </div>
              </div>
            </div>

            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
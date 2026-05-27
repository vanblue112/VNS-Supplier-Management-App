import { useState, useEffect, useCallback } from "react";

// ── constants ──────────────────────────────────────────────────────────────
const INDUSTRIES = ["Dệt may","Giày dép","Thực phẩm / FMCG","Cà phê / Nông sản","Điện tử / Cơ khí","Gỗ / Nội thất","Nhựa / Bao bì","Thủ công mỹ nghệ","Khác"];
const PROVINCES  = ["Hà Nội","TP. Hồ Chí Minh","Bình Dương","Đồng Nai","Hải Phòng","Đà Nẵng","Cần Thơ","Bắc Ninh","Hưng Yên","Long An","Tiền Giang","Khác"];
const CHANNELS   = ["Referral / Network","Triển lãm (HAWA, VietnamExpo...)","Outbound / LinkedIn","Alibaba / Global Sources","Google / Directory ngành"];
const MARKETS    = ["EU","US","Nhật Bản","Hàn Quốc","Úc","Canada","UK","Trung Đông","ASEAN","Khác"];
const STAGES = [
  {id:"B1",label:"B1 Xác định ngành",phase:1},{id:"B2",label:"B2 Longlist",phase:1},{id:"B3",label:"B3 Pre-score",phase:1},
  {id:"B4",label:"B4 Liên hệ",phase:2},{id:"B5",label:"B5 Thu hồ sơ",phase:2},{id:"B6",label:"B6 Chấm VSERF",phase:2},{id:"B7",label:"B7 Xác minh",phase:2},
  {id:"B8",label:"B8 Chuẩn hóa",phase:3},{id:"B9",label:"B9 Onboard",phase:3},{id:"B10",label:"B10 Kích hoạt RFQ",phase:3},{id:"B11",label:"B11 Theo dõi",phase:3},
];
const RFQ_STATUSES = [
  {id:"new",label:"Mới nhận",color:"#185FA5",bg:"#E6F1FB"},
  {id:"searching",label:"Đang tìm NCC",color:"#854F0B",bg:"#FAEEDA"},
  {id:"shortlisted",label:"Đã shortlist",color:"#534AB7",bg:"#EEEDFE"},
  {id:"sent",label:"Đã gửi Sales",color:"#1D9E75",bg:"#EAF3DE"},
  {id:"closed",label:"Closed",color:"#888",bg:"#F0F0F0"},
];
const VSERF_COLS = [
  {id:"phap_ly",label:"01 Pháp lý",desc:"Giấy phép KD, MST, hồ sơ ngành nghề XK đầy đủ"},
  {id:"san_xuat",label:"02 Sản xuất",desc:"Nhà xưởng riêng, công suất ≥ MOQ buyer, máy móc đủ"},
  {id:"chat_luong",label:"03 Chất lượng",desc:"ISO 9001 hoặc tương đương, QC nội bộ 3 lớp"},
  {id:"xuat_khau",label:"04 Xuất khẩu",desc:"Đã XK ≥ 2 năm, thông thạo Incoterms FOB/CIF"},
  {id:"chung_tu",label:"05 Chứng từ",desc:"Tự lập CO, packing list, invoice EN; HS code đúng"},
  {id:"rfq",label:"06 Phản hồi RFQ",desc:"Trả lời ≤24h; báo giá có cost breakdown rõ"},
  {id:"oem_odm",label:"07 OEM/ODM",desc:"Có R&D; làm mẫu 7–10 ngày; tùy chỉnh theo buyer"},
  {id:"giao_tiep",label:"08 Giao tiếp",desc:"Sales tiếng Anh B2+; email/Zoom không cần phiên dịch"},
  {id:"minh_bach",label:"09 Minh bạch",desc:"Sẵn sàng buyer visit, factory audit, factory video"},
];

// ── helpers ────────────────────────────────────────────────────────────────
const calcTier = (vserf={}) => {
  const total = Object.values(vserf).reduce((a,b)=>a+(b||0),0);
  if ((vserf.phap_ly||0)<3||(vserf.san_xuat||0)<3) return {tier:"Not Qualified",color:"#A32D2D",bg:"#FCEBEB",total};
  if (total>=38) return {tier:"Tier 1 — Export-Ready",color:"#3B6D11",bg:"#EAF3DE",total};
  if (total>=27) return {tier:"Tier 2 — Nearly Ready",color:"#185FA5",bg:"#E6F1FB",total};
  if (total>=18) return {tier:"Tier 3 — Developing",color:"#854F0B",bg:"#FAEEDA",total};
  return {tier:"Not Qualified",color:"#A32D2D",bg:"#FCEBEB",total};
};
const calcPerf = (perf={}) => {
  const w={qc:.3,delivery:.25,comm:.2,price:.15,flex:.1};
  const score=((perf.qc||0)*w.qc+(perf.delivery||0)*w.delivery+(perf.comm||0)*w.comm+(perf.price||0)*w.price+(perf.flex||0)*w.flex)/5*100;
  if(score>=85) return {label:"Preferred",color:"#3B6D11",bg:"#EAF3DE",score:Math.round(score)};
  if(score>=65) return {label:"Active",color:"#185FA5",bg:"#E6F1FB",score:Math.round(score)};
  if(score>=45) return {label:"Probation",color:"#854F0B",bg:"#FAEEDA",score:Math.round(score)};
  return {label:"Inactive",color:"#A32D2D",bg:"#FCEBEB",score:Math.round(score)};
};
const emptySupplier = () => ({
  id:Date.now()+"_s", name:"", industry:"", products:"", province:"", website:"",
  contactName:"", zalo:"", email:"", channel:"", stage:"B1",
  notes:"", specialNotes:"", certs:"", moq:"", leadTime:"", incoterm:"",
  vserf:{phap_ly:0,san_xuat:0,chat_luong:0,xuat_khau:0,chung_tu:0,rfq:0,oem_odm:0,giao_tiep:0,minh_bach:0},
  perf:{qc:0,delivery:0,comm:0,price:0,flex:0},
  source:"proactive", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
});
const emptyRFQ = () => ({
  id:Date.now()+"_r", rfqCode:"RFQ-"+Date.now().toString().slice(-5),
  salesPerson:"", receivedDate:new Date().toISOString().slice(0,10),
  productDesc:"", buyerMarket:[], deadline:"", moqQty:"", certRequirements:"",
  priceTarget:"", incoterm:"", additionalNotes:"",
  status:"new", supplierIds:[], supplierNotes:{},
  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
});

const SK_SUP = "vns_suppliers_v2";
const SK_RFQ = "vns_rfqs_v1";
const storeGet = async k => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; } };
const storeSet = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };

// ── root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("list");
  const [suppliers, setSuppliers] = useState([]);
  const [rfqs, setRfqs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // {type, data}
  const [toast, setToast]       = useState(null);

  useEffect(()=>{
    Promise.all([storeGet(SK_SUP),storeGet(SK_RFQ)]).then(([s,r])=>{
      setSuppliers(s||[]); setRfqs(r||[]); setLoading(false);
    });
  },[]);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2400); };

  const saveSuppliers = useCallback(async list => { setSuppliers(list); await storeSet(SK_SUP,list); },[]);
  const saveRfqs      = useCallback(async list => { setRfqs(list);     await storeSet(SK_RFQ,list); },[]);

  const upsertSupplier = async s => {
    const upd={...s,updatedAt:new Date().toISOString()};
    const idx=suppliers.findIndex(x=>x.id===upd.id);
    const next=idx>=0?suppliers.map((x,i)=>i===idx?upd:x):[upd,...suppliers];
    await saveSuppliers(next);
    showToast(idx>=0?"Đã cập nhật supplier":"Đã thêm supplier mới");
    setModal(null);
  };
  const deleteSupplier = async id => {
    if(!confirm("Xóa supplier này?")) return;
    await saveSuppliers(suppliers.filter(x=>x.id!==id));
    setModal(null); showToast("Đã xóa supplier");
  };
  const upsertRFQ = async r => {
    const upd={...r,updatedAt:new Date().toISOString()};
    const idx=rfqs.findIndex(x=>x.id===upd.id);
    const next=idx>=0?rfqs.map((x,i)=>i===idx?upd:x):[upd,...rfqs];
    await saveRfqs(next);
    showToast(idx>=0?"Đã cập nhật RFQ":"Đã tạo RFQ mới");
    setModal(null);
  };
  const deleteRFQ = async id => {
    if(!confirm("Xóa RFQ này?")) return;
    await saveRfqs(rfqs.filter(x=>x.id!==id));
    setModal(null); showToast("Đã xóa RFQ");
  };

  if(loading) return <div style={{padding:"2rem",color:"var(--color-text-secondary)",fontSize:14}}>Đang tải...</div>;

  const ctx = {suppliers,rfqs,upsertSupplier,deleteSupplier,upsertRFQ,deleteRFQ,modal,setModal,showToast};

  return (
    <div style={{fontFamily:"var(--font-sans)",minHeight:"100vh",background:"var(--color-background-tertiary)"}}>
      {toast && <div style={{position:"fixed",top:14,right:14,background:"#1D9E75",color:"#fff",padding:"9px 18px",borderRadius:8,fontSize:13,zIndex:9999,fontWeight:500,boxShadow:"0 2px 12px #0003"}}>{toast}</div>}
      <TopNav tab={tab} setTab={setTab} ctx={ctx}/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"1rem"}}>
        {tab==="list"      && <SupplierList ctx={ctx}/>}
        {tab==="rfq"       && <RFQList ctx={ctx}/>}
        {tab==="dashboard" && <Dashboard ctx={ctx}/>}
      </div>
      {modal?.type==="supplier-form" && <ModalWrap onClose={()=>setModal(null)}><SupplierForm supplier={modal.data} onSave={upsertSupplier} onCancel={()=>setModal(null)}/></ModalWrap>}
      {modal?.type==="supplier-detail" && <ModalWrap onClose={()=>setModal(null)}><SupplierDetail supplier={modal.data} ctx={ctx}/></ModalWrap>}
      {modal?.type==="supplier-scoring" && <ModalWrap onClose={()=>setModal(null)}><ScoringView supplier={modal.data} onSave={s=>{upsertSupplier(s);}} onBack={()=>setModal(null)}/></ModalWrap>}
      {modal?.type==="brief" && <ModalWrap onClose={()=>setModal(null)}><BriefView supplier={modal.data} onBack={()=>setModal(null)}/></ModalWrap>}
      {modal?.type==="rfq-form" && <ModalWrap onClose={()=>setModal(null)}><RFQForm rfq={modal.data} onSave={upsertRFQ} onCancel={()=>setModal(null)}/></ModalWrap>}
      {modal?.type==="rfq-detail" && <ModalWrap onClose={()=>setModal(null)}><RFQDetail rfq={modal.data} ctx={ctx}/></ModalWrap>}
      {modal?.type==="rfq-shortlist" && <ModalWrap onClose={()=>setModal(null)}><RFQShortlist rfq={modal.data} ctx={ctx}/></ModalWrap>}
    </div>
  );
}

// ── nav ────────────────────────────────────────────────────────────────────
function TopNav({tab,setTab,ctx}) {
  const {setModal,rfqs} = ctx;
  const newRfq = rfqs.filter(r=>r.status==="new"||r.status==="searching").length;
  return (
    <div style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"0 1rem"}}>
      <div style={{maxWidth:920,margin:"0 auto",display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontWeight:600,fontSize:14,color:"#1D9E75",paddingRight:12,borderRight:"0.5px solid var(--color-border-tertiary)",marginRight:4,letterSpacing:.3}}>🏭 VinaSources</span>
        {[{id:"list",label:"Supplier DB"},{id:"rfq",label:"RFQ Tracking"},{id:"dashboard",label:"Dashboard"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"12px 10px",fontSize:13,cursor:"pointer",color:tab===t.id?"var(--color-text-primary)":"var(--color-text-secondary)",borderBottom:tab===t.id?"2px solid #1D9E75":"2px solid transparent",fontWeight:tab===t.id?500:400,position:"relative"}}>
            {t.label}
            {t.id==="rfq"&&newRfq>0&&<span style={{position:"absolute",top:6,right:0,background:"#E24B4A",color:"#fff",fontSize:10,fontWeight:700,borderRadius:8,padding:"0 5px",minWidth:14,textAlign:"center"}}>{newRfq}</span>}
          </button>
        ))}
        <div style={{flex:1}}/>
        <button onClick={()=>setModal({type:"rfq-form",data:emptyRFQ()})} style={{padding:"6px 12px",borderRadius:6,border:"0.5px solid #185FA5",background:"none",color:"#185FA5",fontSize:12,cursor:"pointer",fontWeight:500,marginRight:6}}>+ RFQ mới</button>
        <button onClick={()=>setModal({type:"supplier-form",data:emptySupplier()})} style={{padding:"6px 12px",borderRadius:6,border:"none",background:"#1D9E75",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>+ Supplier</button>
      </div>
    </div>
  );
}

// ── modal wrapper ──────────────────────────────────────────────────────────
function ModalWrap({children,onClose}) {
  return (
    <div style={{position:"fixed",inset:0,background:"#0007",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"1rem"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{width:"100%",maxWidth:720,marginTop:"2rem",marginBottom:"2rem"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── supplier list ──────────────────────────────────────────────────────────
function SupplierList({ctx}) {
  const {suppliers,setModal} = ctx;
  const [search,setSearch]   = useState("");
  const [fTier,setFTier]     = useState("all");
  const [fInd,setFInd]       = useState("all");
  const [fStage,setFStage]   = useState("all");

  const industries = [...new Set(suppliers.map(s=>s.industry).filter(Boolean))];
  const filtered = suppliers.filter(s=>{
    const t=calcTier(s.vserf);
    const tm=fTier==="all"||t.tier.startsWith(fTier);
    const im=fInd==="all"||s.industry===fInd;
    const sm=fStage==="all"||s.stage===fStage;
    const q=search.toLowerCase();
    const sr=!q||[s.name,s.products,s.province,s.industry].some(v=>(v||"").toLowerCase().includes(q));
    return tm&&im&&sm&&sr;
  });

  const exportCSV = () => {
    const hdr=["Tên","Ngành","Sản phẩm","Tỉnh/TP","Website","Contact","Zalo","Email","Stage","Tier","VSERF","Lưu ý đặc biệt"];
    const rows=filtered.map(s=>{const t=calcTier(s.vserf);return [s.name,s.industry,s.products,s.province,s.website,s.contactName,s.zalo,s.email,s.stage,t.tier,t.total,s.specialNotes].map(v=>`"${(v||"").replace(/"/g,'""')}"`).join(",");});
    const csv=[hdr.join(","),...rows].join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);a.download="VinaSources_Suppliers.csv";a.click();
  };

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm theo tên, sản phẩm, tỉnh..." style={inputSt}/>
        <Sel value={fTier} onChange={setFTier} opts={[["all","Tất cả Tier"],["Tier 1","Tier 1"],["Tier 2","Tier 2"],["Tier 3","Tier 3"],["Not","Not Qualified"]]}/>
        <Sel value={fInd} onChange={setFInd} opts={[["all","Tất cả ngành"],...industries.map(i=>[i,i])]}/>
        <Sel value={fStage} onChange={setFStage} opts={[["all","Tất cả Stage"],...STAGES.map(s=>[s.id,s.label])]}/>
        <button onClick={exportCSV} style={ghostBtn}>⬇ CSV</button>
      </div>
      <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:8}}>{filtered.length} supplier</div>
      {filtered.length===0&&<Empty text="Chưa có supplier. Nhấn + Supplier để thêm."/>}
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map(s=>{
          const t=calcTier(s.vserf);
          const st=STAGES.find(x=>x.id===s.stage);
          return (
            <div key={s.id} onClick={()=>setModal({type:"supplier-detail",data:s})} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"11px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <div style={{width:34,height:34,borderRadius:8,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {t.tier.startsWith("Tier 1")?"🥇":t.tier.startsWith("Tier 2")?"🥈":t.tier.startsWith("Tier 3")?"🥉":"✕"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name||<span style={{color:"var(--color-text-tertiary)"}}>Chưa đặt tên</span>}</div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{[s.industry,s.province,s.products].filter(Boolean).join(" · ")}</div>
              </div>
              {s.source==="reactive"&&<span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:"#EEEDFE",color:"#534AB7",fontWeight:500,flexShrink:0}}>RFQ</span>}
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:t.bg,color:t.color,fontWeight:500,flexShrink:0}}>{t.tier.split("—")[0].trim()}</span>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",flexShrink:0}}>{st?.id}</span>
              <span style={{fontSize:12,color:"var(--color-text-tertiary)",minWidth:32,textAlign:"right",flexShrink:0}}>{t.total}/45</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── supplier detail ────────────────────────────────────────────────────────
function SupplierDetail({supplier:s,ctx}) {
  const {setModal,deleteSupplier} = ctx;
  const t=calcTier(s.vserf); const p=calcPerf(s.perf);
  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:14}}>
        <div><h2 style={{margin:0,fontSize:17,fontWeight:500}}>{s.name||"(Chưa có tên)"}</h2>
        <div style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:3}}>{s.industry} · {s.province}</div></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{fontSize:12,padding:"3px 10px",borderRadius:5,background:t.bg,color:t.color,fontWeight:500}}>{t.tier} · {t.total}/45</span>
          {s.perf?.qc>0&&<span style={{fontSize:12,padding:"3px 10px",borderRadius:5,background:p.bg,color:p.color,fontWeight:500}}>{p.label} · {p.score}%</span>}
          {s.source==="reactive"&&<span style={{fontSize:11,padding:"3px 8px",borderRadius:5,background:"#EEEDFE",color:"#534AB7",fontWeight:500}}>Từ RFQ</span>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:12}}>
        <IB title="Thông tin cơ bản">
          <IR l="Sản phẩm" v={s.products}/><IR l="Website" v={s.website}/><IR l="Kênh" v={s.channel}/><IR l="Stage" v={STAGES.find(x=>x.id===s.stage)?.label||s.stage}/>
        </IB>
        <IB title="Đầu mối liên hệ">
          <IR l="Tên" v={s.contactName}/><IR l="Zalo/SĐT" v={s.zalo}/><IR l="Email" v={s.email}/>
        </IB>
        <IB title="Năng lực">
          <IR l="Chứng nhận" v={s.certs}/><IR l="MOQ" v={s.moq}/><IR l="Lead time" v={s.leadTime}/><IR l="Incoterm" v={s.incoterm}/>
        </IB>
        <IB title="VSERF">
          {VSERF_COLS.map(c=>(
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"2px 0"}}>
              <span style={{color:"var(--color-text-secondary)"}}>{c.label}</span>
              <span style={{fontWeight:500,color:(s.vserf[c.id]||0)<3&&(c.id==="phap_ly"||c.id==="san_xuat")?"#A32D2D":"var(--color-text-primary)"}}>{s.vserf[c.id]||0}/5</span>
            </div>
          ))}
        </IB>
      </div>
      {s.specialNotes&&<div style={{background:"#FAEEDA",border:"0.5px solid #EF9F27",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:500,color:"#854F0B",marginBottom:3}}>⚠ Lưu ý đặc biệt về sản phẩm</div>
        <div style={{fontSize:13,color:"#633806"}}>{s.specialNotes}</div>
      </div>}
      {s.notes&&<div style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
        <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:2}}>Ghi chú nội bộ</div>
        <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>{s.notes}</div>
      </div>}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setModal({type:"supplier-form",data:s})} style={ghostBtn}>Sửa</button>
        <button onClick={()=>setModal({type:"supplier-scoring",data:s})} style={{...ghostBtn,color:"#1D9E75",borderColor:"#1D9E75"}}>Chấm VSERF</button>
        <button onClick={()=>setModal({type:"brief",data:s})} style={{padding:"7px 14px",borderRadius:6,border:"none",background:"#185FA5",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500}}>Xuất Brief</button>
        <button onClick={()=>deleteSupplier(s.id)} style={{...ghostBtn,color:"#E24B4A",borderColor:"#E24B4A",marginLeft:"auto"}}>Xóa</button>
      </div>
    </Card>
  );
}

// ── supplier form ──────────────────────────────────────────────────────────
function SupplierForm({supplier,onSave,onCancel}) {
  const [f,setF]=useState(supplier);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <Card>
      <h2 style={{margin:"0 0 1rem",fontSize:15,fontWeight:500}}>{f.name?"Sửa: "+f.name:"Thêm supplier mới"}</h2>
      <Sec title="Thông tin cơ bản">
        <Rw l="Tên công ty *"><input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Công ty TNHH ABC" style={inputSt}/></Rw>
        <Rw l="Ngành hàng"><select value={f.industry} onChange={e=>set("industry",e.target.value)} style={inputSt}><option value="">-- Chọn --</option>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></Rw>
        <Rw l="Sản phẩm chủ lực *"><input value={f.products} onChange={e=>set("products",e.target.value)} placeholder="Áo thun cotton, quần kaki export" style={inputSt}/></Rw>
        <Rw l="Tỉnh / Thành phố"><select value={f.province} onChange={e=>set("province",e.target.value)} style={inputSt}><option value="">-- Chọn --</option>{PROVINCES.map(p=><option key={p}>{p}</option>)}</select></Rw>
        <Rw l="Website"><input value={f.website} onChange={e=>set("website",e.target.value)} placeholder="https://..." style={inputSt}/></Rw>
        <Rw l="Kênh tìm kiếm"><select value={f.channel} onChange={e=>set("channel",e.target.value)} style={inputSt}><option value="">-- Chọn --</option>{CHANNELS.map(c=><option key={c}>{c}</option>)}</select></Rw>
      </Sec>
      <Sec title="Đầu mối liên hệ">
        <Rw l="Họ tên"><input value={f.contactName} onChange={e=>set("contactName",e.target.value)} style={inputSt}/></Rw>
        <Rw l="Zalo / SĐT ★"><input value={f.zalo} onChange={e=>set("zalo",e.target.value)} placeholder="0901 234 567" style={inputSt}/></Rw>
        <Rw l="Email"><input value={f.email} onChange={e=>set("email",e.target.value)} style={inputSt}/></Rw>
      </Sec>
      <Sec title="Năng lực & thương mại">
        <Rw l="Chứng nhận"><input value={f.certs} onChange={e=>set("certs",e.target.value)} placeholder="ISO 9001, BSCI, WRAP..." style={inputSt}/></Rw>
        <Rw l="MOQ"><input value={f.moq} onChange={e=>set("moq",e.target.value)} placeholder="500 pcs/SKU" style={inputSt}/></Rw>
        <Rw l="Lead time"><input value={f.leadTime} onChange={e=>set("leadTime",e.target.value)} placeholder="30–45 ngày" style={inputSt}/></Rw>
        <Rw l="Incoterm"><input value={f.incoterm} onChange={e=>set("incoterm",e.target.value)} placeholder="FOB, CIF, EXW" style={inputSt}/></Rw>
      </Sec>
      <Sec title="Lưu ý đặc biệt về sản phẩm">
        <textarea value={f.specialNotes} onChange={e=>set("specialNotes",e.target.value)} placeholder="VD: Chỉ làm cotton 100%, không nhận đơn pha len. Min 1000 pcs/màu. Không làm size XS/XXL..." style={{...inputSt,minHeight:80,resize:"vertical",width:"100%",boxSizing:"border-box"}}/>
      </Sec>
      <Sec title="Pipeline">
        <Rw l="Stage"><select value={f.stage} onChange={e=>set("stage",e.target.value)} style={inputSt}>{STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Rw>
        <Rw l="Ghi chú nội bộ"><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} style={{...inputSt,minHeight:60,resize:"vertical",width:"100%",boxSizing:"border-box"}}/></Rw>
      </Sec>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={onCancel} style={ghostBtn}>Hủy</button>
        <button onClick={()=>onSave(f)} style={primaryBtn}>Lưu</button>
      </div>
    </Card>
  );
}

// ── scoring ────────────────────────────────────────────────────────────────
function ScoringView({supplier,onSave,onBack}) {
  const [sc,setSc]=useState({...supplier.vserf});
  const [pf,setPf]=useState({...supplier.perf});
  const t=calcTier(sc);
  return (
    <Card>
      <h2 style={{margin:"0 0 4px",fontSize:15,fontWeight:500}}>VSERF — {supplier.name}</h2>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12}}>9 trụ cột · 1–5 điểm · Tổng tối đa 45</div>
      <div style={{background:t.bg,border:`1px solid ${t.color}`,borderRadius:8,padding:"10px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:500,color:t.color,fontSize:14}}>{t.tier}</span>
        <span style={{fontWeight:600,color:t.color,fontSize:18}}>{t.total} / 45</span>
      </div>
      {VSERF_COLS.map(c=>{
        const v=sc[c.id]||0; const warn=(c.id==="phap_ly"||c.id==="san_xuat")&&v<3;
        return (
          <div key={c.id} style={{marginBottom:12,padding:"10px 12px",border:`0.5px solid ${warn?"#E24B4A":"var(--color-border-tertiary)"}`,borderRadius:8,background:warn?"#FFF5F5":"var(--color-background-secondary)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontWeight:500,fontSize:13,color:warn?"#A32D2D":"var(--color-text-primary)"}}>{c.label}</span>
              <span style={{fontWeight:500,fontSize:14,color:warn?"#A32D2D":"var(--color-text-primary)"}}>{v}/5</span>
            </div>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:5}}>{c.desc}</div>
            {warn&&<div style={{fontSize:11,color:"#A32D2D",marginBottom:4}}>⚠ Bắt buộc ≥3 — dưới ngưỡng → Not Qualified</div>}
            <input type="range" min={0} max={5} step={1} value={v} onChange={e=>setSc(p=>({...p,[c.id]:+e.target.value}))} style={{width:"100%"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--color-text-tertiary)"}}>{[0,1,2,3,4,5].map(n=><span key={n}>{n}</span>)}</div>
          </div>
        );
      })}
      <div style={{fontSize:13,fontWeight:500,margin:"14px 0 8px"}}>Hiệu suất định kỳ (nếu đã có đơn)</div>
      {[{id:"qc",l:"Pass QC lần đầu",w:"30%"},{id:"delivery",l:"Giao hàng đúng hạn",w:"25%"},{id:"comm",l:"Phản hồi & giao tiếp",w:"20%"},{id:"price",l:"Giá cạnh tranh",w:"15%"},{id:"flex",l:"Xử lý phát sinh",w:"10%"}].map(c=>(
        <div key={c.id} style={{marginBottom:10,display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center"}}>
          <div><div style={{fontSize:13}}>{c.l} <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>({c.w})</span></div>
          <input type="range" min={0} max={5} step={1} value={pf[c.id]||0} onChange={e=>setPf(p=>({...p,[c.id]:+e.target.value}))} style={{width:"100%"}}/></div>
          <span style={{fontSize:14,fontWeight:500,minWidth:28,textAlign:"right"}}>{pf[c.id]||0}/5</span>
        </div>
      ))}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
        <button onClick={onBack} style={ghostBtn}>Hủy</button>
        <button onClick={()=>onSave({...supplier,vserf:sc,perf:pf})} style={primaryBtn}>Lưu điểm</button>
      </div>
    </Card>
  );
}

// ── brief ──────────────────────────────────────────────────────────────────
function BriefView({supplier:s,onBack}) {
  const t=calcTier(s.vserf); const today=new Date().toLocaleDateString("vi-VN");
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
        <button onClick={onBack} style={ghostBtn}>← Quay lại</button>
        <button onClick={()=>window.print()} style={{...ghostBtn,marginLeft:"auto"}}>🖨 In / PDF</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:"1.8rem",color:"#1a1a1a"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"2px solid #1D9E75",paddingBottom:12,marginBottom:14}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#1D9E75",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>VinaSources — Supplier Brief</div>
            <h1 style={{margin:0,fontSize:20,fontWeight:600,color:"#1a1a1a"}}>{s.name}</h1>
            <div style={{fontSize:12,color:"#555",marginTop:3}}>{s.industry} · {s.province}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:16,fontWeight:700,padding:"5px 12px",borderRadius:6,background:t.bg,color:t.color}}>{t.tier.split("—")[0].trim()}</div>
            <div style={{fontSize:11,color:t.color,marginTop:3}}>{t.total}/45 VSERF</div>
            <div style={{fontSize:10,color:"#aaa",marginTop:3}}>{today}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:12}}>
          <div><Label>Sản phẩm chủ lực</Label><div style={{fontSize:13,lineHeight:1.6}}>{s.products||"—"}</div></div>
          <div><Label>Năng lực thương mại</Label>
            <div style={{fontSize:12,lineHeight:1.9}}>
              {s.moq&&<div><span style={{color:"#777"}}>MOQ: </span>{s.moq}</div>}
              {s.leadTime&&<div><span style={{color:"#777"}}>Lead time: </span>{s.leadTime}</div>}
              {s.incoterm&&<div><span style={{color:"#777"}}>Incoterm: </span>{s.incoterm}</div>}
              {s.certs&&<div><span style={{color:"#777"}}>Chứng nhận: </span>{s.certs}</div>}
            </div>
          </div>
        </div>
        {s.specialNotes&&<div style={{background:"#FFFBF0",border:"1.5px solid #F0C040",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A6200",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>⚠ Lưu ý đặc biệt về sản phẩm</div>
          <div style={{fontSize:13,color:"#5C4000",lineHeight:1.7}}>{s.specialNotes}</div>
        </div>}
        <div style={{background:"#F0F9F5",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
          <Label style={{color:"#0F6E56"}}>Đầu mối liên hệ</Label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12}}>
            <div><div style={{color:"#0F6E56",fontSize:10}}>Tên</div><div style={{fontWeight:500}}>{s.contactName||"—"}</div></div>
            <div><div style={{color:"#0F6E56",fontSize:10}}>Zalo/SĐT</div><div style={{fontWeight:500}}>{s.zalo||"—"}</div></div>
            <div><div style={{color:"#0F6E56",fontSize:10}}>Email</div><div style={{fontWeight:500,wordBreak:"break-all"}}>{s.email||"—"}</div></div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {VSERF_COLS.slice(0,6).map(c=>{const v=s.vserf[c.id]||0;return(
            <div key={c.id} style={{background:"#F8F8F8",borderRadius:6,padding:"7px 9px"}}>
              <div style={{fontSize:9,color:"#888",marginBottom:3}}>{c.label}</div>
              <div style={{height:4,borderRadius:2,background:"#E0E0E0",overflow:"hidden"}}><div style={{height:"100%",width:(v/5*100)+"%",background:v>=4?"#1D9E75":v>=3?"#378ADD":v>=2?"#BA7517":"#E24B4A"}}/></div>
              <div style={{fontSize:11,fontWeight:600,color:"#333",marginTop:2}}>{v}/5</div>
            </div>
          );})}
        </div>
        {s.website&&<div style={{marginTop:10,fontSize:11,color:"#888"}}>🌐 {s.website}</div>}
        <div style={{marginTop:14,paddingTop:10,borderTop:"0.5px solid #eee",fontSize:10,color:"#bbb",display:"flex",justifyContent:"space-between"}}>
          <span>VinaSources Supply Chain · Confidential</span><span>Xuất {today}</span>
        </div>
      </div>
    </div>
  );
}

// ── RFQ list ───────────────────────────────────────────────────────────────
function RFQList({ctx}) {
  const {rfqs,setModal} = ctx;
  const [fStatus,setFStatus]=useState("all");
  const filtered=rfqs.filter(r=>fStatus==="all"||r.status===fStatus);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:500}}>RFQ Tracking</span>
        <div style={{flex:1}}/>
        <Sel value={fStatus} onChange={setFStatus} opts={[["all","Tất cả trạng thái"],...RFQ_STATUSES.map(s=>[s.id,s.label])]}/>
      </div>
      {filtered.length===0&&<Empty text="Chưa có RFQ. Nhấn + RFQ mới để tạo."/>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(r=>{
          const st=RFQ_STATUSES.find(x=>x.id===r.status)||RFQ_STATUSES[0];
          const urgent=r.deadline&&new Date(r.deadline)<new Date(Date.now()+3*86400000);
          return (
            <div key={r.id} onClick={()=>setModal({type:"rfq-detail",data:r})} style={{background:"var(--color-background-primary)",border:`0.5px solid ${urgent&&r.status!=="closed"?"#E24B4A":"var(--color-border-tertiary)"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontWeight:500,fontSize:12,color:"var(--color-text-tertiary)",minWidth:80}}>{r.rfqCode}</span>
                <span style={{fontWeight:500,fontSize:14,flex:1}}>{r.productDesc||"(Chưa mô tả)"}</span>
                <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:st.bg,color:st.color,fontWeight:500}}>{st.label}</span>
                {urgent&&r.status!=="closed"&&<span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:"#FCEBEB",color:"#A32D2D",fontWeight:500}}>🔴 Gấp</span>}
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:4,display:"flex",gap:12,flexWrap:"wrap"}}>
                {r.buyerMarket?.length>0&&<span>🌍 {r.buyerMarket.join(", ")}</span>}
                {r.deadline&&<span>📅 Deadline: {r.deadline}</span>}
                {r.salesPerson&&<span>👤 {r.salesPerson}</span>}
                {r.supplierIds?.length>0&&<span>🏭 {r.supplierIds.length} NCC được gán</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── RFQ form ───────────────────────────────────────────────────────────────
function RFQForm({rfq,onSave,onCancel}) {
  const [f,setF]=useState(rfq);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleMarket=m=>set("buyerMarket",f.buyerMarket?.includes(m)?f.buyerMarket.filter(x=>x!==m):[...(f.buyerMarket||[]),m]);
  return (
    <Card>
      <h2 style={{margin:"0 0 1rem",fontSize:15,fontWeight:500}}>{rfq.salesPerson?"Sửa RFQ":"Tạo RFQ mới từ Sales"}</h2>
      <Sec title="Thông tin RFQ">
        <Rw l="Mã RFQ"><input value={f.rfqCode} onChange={e=>set("rfqCode",e.target.value)} style={inputSt}/></Rw>
        <Rw l="Sales phụ trách"><input value={f.salesPerson} onChange={e=>set("salesPerson",e.target.value)} placeholder="Nguyễn Văn B" style={inputSt}/></Rw>
        <Rw l="Ngày nhận"><input type="date" value={f.receivedDate} onChange={e=>set("receivedDate",e.target.value)} style={inputSt}/></Rw>
        <Rw l="Deadline báo giá"><input type="date" value={f.deadline} onChange={e=>set("deadline",e.target.value)} style={inputSt}/></Rw>
      </Sec>
      <Sec title="Yêu cầu sản phẩm">
        <Rw l="Mô tả sản phẩm *"><textarea value={f.productDesc} onChange={e=>set("productDesc",e.target.value)} placeholder="VD: Áo polo cotton pique 220gsm, logo thêu, size S-XXL, 5 màu..." style={{...inputSt,minHeight:70,resize:"vertical",width:"100%",boxSizing:"border-box"}}/></Rw>
        <Rw l="Thị trường buyer">
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {MARKETS.map(m=>(
              <button key={m} onClick={()=>toggleMarket(m)} style={{padding:"4px 10px",borderRadius:5,border:`0.5px solid ${f.buyerMarket?.includes(m)?"#185FA5":"var(--color-border-secondary)"}`,background:f.buyerMarket?.includes(m)?"#E6F1FB":"none",color:f.buyerMarket?.includes(m)?"#185FA5":"var(--color-text-secondary)",fontSize:12,cursor:"pointer"}}>{m}</button>
            ))}
          </div>
        </Rw>
        <Rw l="MOQ / Số lượng"><input value={f.moqQty} onChange={e=>set("moqQty",e.target.value)} placeholder="VD: 500 pcs, 1 container 20ft" style={inputSt}/></Rw>
        <Rw l="Giá mục tiêu"><input value={f.priceTarget} onChange={e=>set("priceTarget",e.target.value)} placeholder="VD: FOB $3.5–4.0/pcs" style={inputSt}/></Rw>
        <Rw l="Incoterm"><input value={f.incoterm} onChange={e=>set("incoterm",e.target.value)} placeholder="FOB HCMC" style={inputSt}/></Rw>
        <Rw l="Chứng chỉ yêu cầu"><input value={f.certRequirements} onChange={e=>set("certRequirements",e.target.value)} placeholder="VD: BSCI, REACH, CA65..." style={inputSt}/></Rw>
        <Rw l="Ghi chú thêm"><textarea value={f.additionalNotes} onChange={e=>set("additionalNotes",e.target.value)} placeholder="Yêu cầu đặc biệt, packaging, label..." style={{...inputSt,minHeight:60,resize:"vertical",width:"100%",boxSizing:"border-box"}}/></Rw>
      </Sec>
      <Sec title="Trạng thái">
        <Rw l="Status"><select value={f.status} onChange={e=>set("status",e.target.value)} style={inputSt}>{RFQ_STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Rw>
      </Sec>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={onCancel} style={ghostBtn}>Hủy</button>
        <button onClick={()=>onSave(f)} style={primaryBtn}>Lưu RFQ</button>
      </div>
    </Card>
  );
}

// ── RFQ detail ─────────────────────────────────────────────────────────────
function RFQDetail({rfq,ctx}) {
  const {suppliers,setModal,upsertRFQ,deleteRFQ} = ctx;
  const st=RFQ_STATUSES.find(x=>x.id===rfq.status)||RFQ_STATUSES[0];
  const assignedSuppliers=suppliers.filter(s=>rfq.supplierIds?.includes(s.id));

  const addNewSupplierForRFQ=()=>{
    const ns={...emptySupplier(),source:"reactive"};
    setModal({type:"supplier-form",data:ns});
  };

  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:14}}>
        <div>
          <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:2}}>{rfq.rfqCode}</div>
          <h2 style={{margin:0,fontSize:16,fontWeight:500}}>{rfq.productDesc||"(Chưa mô tả)"}</h2>
          {rfq.salesPerson&&<div style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:3}}>👤 {rfq.salesPerson}</div>}
        </div>
        <span style={{fontSize:12,padding:"4px 12px",borderRadius:5,background:st.bg,color:st.color,fontWeight:500}}>{st.label}</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:14}}>
        <IB title="Yêu cầu">
          <IR l="Thị trường" v={rfq.buyerMarket?.join(", ")}/>
          <IR l="MOQ / SL" v={rfq.moqQty}/>
          <IR l="Giá mục tiêu" v={rfq.priceTarget}/>
          <IR l="Incoterm" v={rfq.incoterm}/>
          <IR l="Chứng chỉ" v={rfq.certRequirements}/>
        </IB>
        <IB title="Timeline">
          <IR l="Ngày nhận" v={rfq.receivedDate}/>
          <IR l="Deadline" v={rfq.deadline}/>
        </IB>
      </div>
      {rfq.additionalNotes&&<div style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
        <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:2}}>Ghi chú thêm</div>
        <div style={{fontSize:13}}>{rfq.additionalNotes}</div>
      </div>}

      {/* NCC gán vào RFQ */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>NCC được gán ({assignedSuppliers.length})</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setModal({type:"rfq-shortlist",data:rfq})} style={{...ghostBtn,fontSize:11,padding:"3px 8px"}}>+ Gán NCC từ DB</button>
            <button onClick={addNewSupplierForRFQ} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:"0.5px solid #534AB7",background:"none",color:"#534AB7",cursor:"pointer"}}>+ Thêm NCC mới</button>
          </div>
        </div>
        {assignedSuppliers.length===0&&<div style={{fontSize:13,color:"var(--color-text-tertiary)",padding:"10px 0"}}>Chưa có NCC nào. Gán từ DB hoặc thêm mới.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {assignedSuppliers.map(s=>{
            const t=calcTier(s.vserf);
            const note=rfq.supplierNotes?.[s.id]||"";
            return (
              <div key={s.id} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontWeight:500,fontSize:13}}>{s.name}</span>
                    <span style={{fontSize:11,padding:"1px 7px",borderRadius:4,background:t.bg,color:t.color,fontWeight:500}}>{t.tier.split("—")[0].trim()} · {t.total}/45</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{s.products} · {s.province}</div>
                  {s.zalo&&<div style={{fontSize:12,color:"var(--color-text-secondary)"}}>📱 {s.zalo}</div>}
                  <input value={note} onChange={e=>{const nn={...rfq.supplierNotes,[s.id]:e.target.value};upsertRFQ({...rfq,supplierNotes:nn});}} placeholder="Ghi chú về NCC này (báo giá, phản hồi...)" style={{...inputSt,fontSize:12,marginTop:6,width:"100%",boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  <button onClick={()=>setModal({type:"brief",data:s})} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:"none",background:"#185FA5",color:"#fff",cursor:"pointer"}}>Brief</button>
                  <button onClick={()=>{const ids=rfq.supplierIds.filter(x=>x!==s.id);upsertRFQ({...rfq,supplierIds:ids});}} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:"0.5px solid #E24B4A",background:"none",color:"#E24B4A",cursor:"pointer"}}>Bỏ</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {assignedSuppliers.length>=2&&<button onClick={()=>setModal({type:"rfq-shortlist-out",data:rfq})} style={{...primaryBtn,width:"100%",marginBottom:10}}>📋 Xuất Shortlist gửi Sales</button>}

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setModal({type:"rfq-form",data:rfq})} style={ghostBtn}>Sửa RFQ</button>
        <div style={{display:"flex",gap:6,alignItems:"center",marginLeft:"auto"}}>
          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>Cập nhật trạng thái:</span>
          <select value={rfq.status} onChange={e=>upsertRFQ({...rfq,status:e.target.value})} style={{...inputSt,padding:"4px 8px",fontSize:12}}>
            {RFQ_STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <button onClick={()=>deleteRFQ(rfq.id)} style={{...ghostBtn,color:"#E24B4A",borderColor:"#E24B4A"}}>Xóa</button>
      </div>
    </Card>
  );
}

// ── assign suppliers to RFQ ────────────────────────────────────────────────
function RFQShortlist({rfq,ctx}) {
  const {suppliers,upsertRFQ,setModal} = ctx;
  const [sel,setSel]=useState(rfq.supplierIds||[]);
  const [search,setSearch]=useState("");
  const filtered=suppliers.filter(s=>{
    const q=search.toLowerCase();
    return !q||[s.name,s.products,s.industry].some(v=>(v||"").toLowerCase().includes(q));
  });
  const toggle=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const save=()=>{upsertRFQ({...rfq,supplierIds:sel,status:sel.length>0?"shortlisted":rfq.status});setModal(null);};
  return (
    <Card>
      <h2 style={{margin:"0 0 10px",fontSize:15,fontWeight:500}}>Gán NCC vào {rfq.rfqCode}</h2>
      <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:12,padding:"8px 12px",background:"#E6F1FB",borderRadius:6}}>
        📋 Sản phẩm: {rfq.productDesc||"—"} · Thị trường: {rfq.buyerMarket?.join(", ")||"—"} · Chứng chỉ: {rfq.certRequirements||"—"}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm NCC..." style={{...inputSt,marginBottom:10,width:"100%",boxSizing:"border-box"}}/>
      <div style={{maxHeight:380,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map(s=>{
          const t=calcTier(s.vserf); const checked=sel.includes(s.id);
          return (
            <div key={s.id} onClick={()=>toggle(s.id)} style={{background:checked?"var(--color-background-secondary)":"var(--color-background-primary)",border:`0.5px solid ${checked?"#1D9E75":"var(--color-border-tertiary)"}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${checked?"#1D9E75":"#ccc"}`,background:checked?"#1D9E75":"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {checked&&<span style={{color:"#fff",fontSize:11,lineHeight:1}}>✓</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,fontSize:13}}>{s.name}</div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.products} · {s.province}</div>
              </div>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:t.bg,color:t.color,fontWeight:500,flexShrink:0}}>{t.tier.split("—")[0].trim()} · {t.total}/45</span>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",marginTop:12}}>
        <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{sel.length} NCC được chọn</span>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setModal(null)} style={ghostBtn}>Hủy</button>
          <button onClick={save} style={primaryBtn}>Lưu & cập nhật RFQ</button>
        </div>
      </div>
    </Card>
  );
}

// ── dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ctx}) {
  const {suppliers,rfqs}=ctx;
  const tiers={t1:0,t2:0,t3:0,nq:0};
  let totalVserf=0,vserfCnt=0;
  suppliers.forEach(s=>{
    const t=calcTier(s.vserf);
    if(t.tier.startsWith("Tier 1"))tiers.t1++;
    else if(t.tier.startsWith("Tier 2"))tiers.t2++;
    else if(t.tier.startsWith("Tier 3"))tiers.t3++;
    else tiers.nq++;
    if(t.total>0){totalVserf+=t.total;vserfCnt++;}
  });
  const avgV=vserfCnt?Math.round(totalVserf/vserfCnt):0;
  const t12pct=suppliers.length?Math.round((tiers.t1+tiers.t2)/suppliers.length*100):0;
  const rfqOpen=rfqs.filter(r=>r.status!=="closed").length;
  const rfqSent=rfqs.filter(r=>r.status==="sent").length;
  const stageCount={};
  suppliers.forEach(s=>{stageCount[s.stage]=(stageCount[s.stage]||0)+1;});
  const industries={};
  suppliers.forEach(s=>{if(s.industry)industries[s.industry]=(industries[s.industry]||0)+1;});

  const kpis=[
    {l:"Tổng supplier",v:suppliers.length,t:"—",c:"#185FA5"},
    {l:"Tier 1+2",v:tiers.t1+tiers.t2,t:"≥40%",c:"#1D9E75"},
    {l:"Tỷ lệ T1+T2",v:t12pct+"%",t:"≥40%",c:t12pct>=40?"#1D9E75":"#E24B4A"},
    {l:"VSERF trung bình",v:avgV+"/45",t:"≥32/45",c:avgV>=32?"#1D9E75":"#E24B4A"},
    {l:"RFQ đang mở",v:rfqOpen,t:"—",c:"#534AB7"},
    {l:"RFQ đã gửi Sales",v:rfqSent,t:"—",c:"#854F0B"},
  ];

  return (
    <div>
      <div style={{fontSize:15,fontWeight:500,marginBottom:12}}>Dashboard Management</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:14}}>
        {kpis.map(k=>(
          <div key={k.l} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:500,color:k.c}}>{k.v}</div>
            <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>Mục tiêu: {k.t}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem"}}>
          <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Phân bổ Tier</div>
          {[{l:"Tier 1 Export-Ready",v:tiers.t1,c:"#1D9E75",bg:"#EAF3DE"},{l:"Tier 2 Nearly Ready",v:tiers.t2,c:"#185FA5",bg:"#E6F1FB"},{l:"Tier 3 Developing",v:tiers.t3,c:"#854F0B",bg:"#FAEEDA"},{l:"Not Qualified",v:tiers.nq,c:"#A32D2D",bg:"#FCEBEB"}].map(r=>(
            <div key={r.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:8,height:8,borderRadius:2,background:r.c,flexShrink:0}}/>
              <span style={{fontSize:12,color:"var(--color-text-secondary)",flex:1}}>{r.l}</span>
              <span style={{fontSize:13,fontWeight:500,color:r.c}}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem"}}>
          <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>RFQ theo trạng thái</div>
          {RFQ_STATUSES.map(st=>{
            const cnt=rfqs.filter(r=>r.status===st.id).length;
            return (
              <div key={st.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:2,background:st.color,flexShrink:0}}/>
                <span style={{fontSize:12,color:"var(--color-text-secondary)",flex:1}}>{st.label}</span>
                <span style={{fontSize:13,fontWeight:500,color:st.color}}>{cnt}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Pipeline — Số supplier theo bước</div>
        {STAGES.map(st=>{
          const cnt=stageCount[st.id]||0;const max=Math.max(...Object.values(stageCount),1);
          return (
            <div key={st.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
              <span style={{fontSize:10,color:"var(--color-text-tertiary)",minWidth:22}}>{st.id}</span>
              <div style={{flex:1,height:8,background:"var(--color-background-secondary)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:(cnt/max*100)+"%",background:st.phase===1?"#9FE1CB":st.phase===2?"#B5D4F4":"#EEEDFE",borderRadius:4}}/>
              </div>
              <span style={{fontSize:12,fontWeight:500,minWidth:18,textAlign:"right"}}>{cnt}</span>
            </div>
          );
        })}
      </div>
      {Object.keys(industries).length>0&&<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem"}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Ngành hàng</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {Object.entries(industries).sort((a,b)=>b[1]-a[1]).map(([ind,cnt])=>(
            <div key={ind} style={{padding:"4px 10px",borderRadius:16,background:"var(--color-background-secondary)",fontSize:12,color:"var(--color-text-secondary)"}}>{ind} <b style={{color:"var(--color-text-primary)"}}>{cnt}</b></div>
          ))}
        </div>
      </div>}
    </div>
  );
}

// ── shared UI atoms ────────────────────────────────────────────────────────
const inputSt={padding:"7px 10px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,width:"100%"};
const ghostBtn={padding:"7px 14px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"none",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)"};
const primaryBtn={padding:"7px 18px",borderRadius:6,border:"none",background:"#1D9E75",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500};

function Card({children}) { return <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.4rem"}}>{children}</div>; }
function Sec({title,children}) { return <div style={{marginBottom:"1.1rem"}}><div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:1,marginBottom:7,borderBottom:"0.5px solid var(--color-border-tertiary)",paddingBottom:4}}>{title}</div><div style={{display:"grid",gap:7}}>{children}</div></div>; }
function Rw({l,children}) { return <div style={{display:"grid",gridTemplateColumns:"130px 1fr",gap:8,alignItems:"start"}}><span style={{fontSize:13,color:"var(--color-text-secondary)",paddingTop:8,lineHeight:1.3}}>{l}</span><div>{children}</div></div>; }
function IB({title,children}) { return <div><div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:5}}>{title}</div>{children}</div>; }
function IR({l,v}) { return <div style={{display:"flex",gap:8,fontSize:13,padding:"2px 0"}}><span style={{color:"var(--color-text-secondary)",minWidth:75}}>{l}</span><span style={{flex:1}}>{v||<span style={{color:"var(--color-text-tertiary)"}}>—</span>}</span></div>; }
function Label({children}) { return <div style={{fontSize:10,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{children}</div>; }
function Sel({value,onChange,opts}) { return <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"7px 10px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13}}>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>; }
function Empty({text}) { return <div style={{textAlign:"center",padding:"2.5rem",color:"var(--color-text-secondary)",fontSize:13}}>{text}</div>; }

// ============================================================
// qc-data.js — VinaSources QC Checklist Data
// 6 ngành × 5 phase (IPI, DUPRO, FRI, CLI, POST)
// Format item: [VI_text, EN_text, 'critical'|'major'|'minor']
// ============================================================

const CAT_DATA = {
  wood:    { name:'Nội thất gỗ',           nameEn:'Wood Furniture' },
  textile: { name:'Dệt may & NL tự nhiên', nameEn:'Textile & Natural Materials' },
  shoes:   { name:'Giày dép',              nameEn:'Footwear' },
  fashion: { name:'Thời trang & Phụ kiện', nameEn:'Fashion & Accessories' },
  craft:   { name:'Thủ công mỹ nghệ',      nameEn:'Handicrafts & Gifts' },
  agri:    { name:'Cà phê & Nông sản',     nameEn:'Coffee & Agri' },
};

const CL = {

// ============================================================
// PHASE 1: IPI
// ============================================================
ipi: {
  wood: [
    { lbl:'Nguyên vật liệu chính (gỗ)', lblEn:'Main Raw Materials (Wood)', items:[
      ['Gỗ đúng chủng loại theo spec — KHÔNG dùng gỗ thuộc danh mục cấm CITES','Wood species per spec — NO CITES-listed prohibited species','critical'],
      ['Có chứng từ nguồn gốc hợp pháp (FSC/PEFC/VPA-FLEGT) cho thị trường XK EU/US','Legal origin docs (FSC/PEFC/VPA-FLEGT) for EU/US export','critical'],
      ['Độ ẩm gỗ ≤12% — đo trực tiếp tại lô nguyên liệu (≥5 điểm đo)','Moisture content ≤12% measured at ≥5 points','critical'],
      ['Không có sâu mọt, mục ruỗng, nấm mốc trong nguyên liệu thô','No insect damage, rot, or fungal growth in raw materials','critical'],
      ['Gỗ đã qua xử lý nhiệt/sấy đúng quy cách (ISPM-15 nếu xuất pallet)','Heat-treated per ISPM-15 if export pallet/crating','critical'],
      ['Vân gỗ, màu tự nhiên đồng đều theo grade A đã duyệt','Grain and color uniform per approved grade A','major'],
      ['Không có mắt chết, vết nứt xuyên >20mm trong nguyên liệu','No dead knots or through-cracks >20mm','major'],
      ['Kích thước nguyên liệu phù hợp công đoạn cắt (dư biên ≥10mm)','Raw material dimensions adequate for cutting (≥10mm allowance)','major'],
      ['Bề mặt gỗ thô không vết bẩn dầu, mực, bút','Rough surface free of oil, ink, pen marks','minor'],
      ['Số lượng nguyên liệu khớp BOM ±2%','Raw material qty matches BOM ±2%','minor'],
    ]},
    { lbl:'Nguyên phụ liệu (hardware, sơn, keo)', lblEn:'Hardware, Paint, Adhesive', items:[
      ['Sơn/lacquer KHÔNG chứa chì, formaldehyde vượt EU REACH/US CPSIA','Paint/lacquer: NO lead, formaldehyde above EU REACH/US CPSIA','critical'],
      ['Keo dán đúng loại E0/E1 (formaldehyde emission tiêu chuẩn XK)','Adhesive E0/E1 grade per export standard','critical'],
      ['Hardware (vít, ốc, bản lề, ray) đúng spec, có chứng nhận chống gỉ','Hardware per spec, with anti-corrosion certification','major'],
      ['Sơn/lacquer đúng màu Pantone/RAL đã duyệt — so sánh trực tiếp','Paint/lacquer matches approved Pantone/RAL','major'],
      ['Hạn sử dụng keo/sơn còn ≥6 tháng','Adhesive/paint shelf life ≥6 months','major'],
      ['Số lượng hardware đủ cho lô + dự phòng 3–5%','Hardware qty sufficient + 3–5% spare','minor'],
    ]},
    { lbl:'Mẫu đầu dây chuyền (First-off)', lblEn:'First-off Production Sample', items:[
      ['Mẫu đầu khớp Golden Sample 100% về thiết kế, mộng ghép','First-off 100% matches Golden Sample on design and joinery','critical'],
      ['Kích thước tổng đúng bản vẽ — sai lệch ≤±1mm','Overall dimensions per drawing — tolerance ≤±1mm','major'],
      ['Mộng ghép, vít liên kết test lực ngang đạt yêu cầu (≥50kg)','Joints/screws pass lateral load test (≥50kg)','major'],
      ['Bề mặt sơn lớp đầu đều, không bọng khí, không chảy','First paint coat even, no bubbles or runs','major'],
      ['Vị trí lỗ khoan, đường cắt khớp template','Drill holes and cut lines match template','minor'],
      ['Logo/ký hiệu khắc đúng vị trí mẫu','Logo/engraving at correct sample position','minor'],
    ]},
    { lbl:'Thiết bị & điều kiện xưởng', lblEn:'Equipment & Factory', items:[
      ['Có hệ thống PCCC hoạt động, lối thoát hiểm thông thoáng','Active fire safety, clear emergency exits','critical'],
      ['Máy cưa, bào, phay có che chắn an toàn','Saw, planer, router have proper safety guards','major'],
      ['Hệ thống hút bụi/thông gió đủ công suất','Dust extraction/ventilation adequate','major'],
      ['Kho nguyên liệu khô ráo, cách ẩm với nền','Material warehouse dry, raised from floor','major'],
      ['Đèn chiếu sáng tại khu cắt/lắp ráp ≥500 lux','Lighting ≥500 lux at cutting/assembly area','minor'],
      ['Nhân công có PPE khi vận hành','Workers wear PPE during operation','minor'],
    ]},
  ],

  textile: [
    { lbl:'Vải & sợi chính', lblEn:'Main Fabric & Yarn', items:[
      ['Thành phần sợi đúng spec (cotton%, polyester%...) — verify mill certificate','Fiber composition per spec — verify mill cert','critical'],
      ['Không chứa AZO dye, formaldehyde, kim loại nặng vượt OEKO-TEX/REACH','No AZO dye, formaldehyde, heavy metals above OEKO-TEX/REACH','critical'],
      ['Vải qua test color fastness — rubbing/washing ≥4 (grayscale)','Color fastness rubbing/washing ≥4 (grayscale)','critical'],
      ['Màu vải đúng lab dip đã duyệt — so trực tiếp dưới D65','Color matches approved lab dip under D65','major'],
      ['GSM (g/m²) đúng spec ±5%','GSM within spec ±5%','major'],
      ['Khổ vải (width) đúng spec, không lệch >2cm','Fabric width per spec, no skew >2cm','major'],
      ['Không có lỗi cuộn: sọc rõ, lỗ thủng, đứt sợi, vón','No bolt defects: streaks, holes, broken yarns, slubs','major'],
      ['Số cuộn khớp shipping doc, đúng dye lot','Bolt count matches shipping doc, correct dye lot','minor'],
      ['Không mùi hóa chất tẩy/nhuộm quá mức','No excessive chemical/dyeing odor','minor'],
    ]},
    { lbl:'Phụ liệu (chỉ, khuy, zipper, label)', lblEn:'Trims (Thread, Buttons, Zipper, Labels)', items:[
      ['Phụ liệu không nickel quá ngưỡng EU (≤0.5 µg/cm²/tuần)','Trims nickel release ≤0.5 µg/cm²/week per EU','critical'],
      ['Khuy/zipper test pull đạt — không tuột khỏi vải','Buttons/zipper pass pull test — no detachment','critical'],
      ['Chỉ may đúng chi số, độ bền kéo đạt spec','Sewing thread correct count, tensile strength per spec','major'],
      ['Zipper trơn tru, kéo ≥20 lần không kẹt','Zipper smooth, ≥20 cycles without jamming','major'],
      ['Label: composition, COO, care symbol đúng quy định','Labels: composition, COO, care symbols compliant','major'],
      ['Số lượng phụ liệu đủ cho lô + dự phòng 5%','Trim qty sufficient + 5% spare','minor'],
    ]},
    { lbl:'Mẫu đầu dây chuyền', lblEn:'First-off Sample', items:[
      ['Mẫu cắt may đầu khớp Golden Sample 100% về fit, form, label position','First cut sample 100% matches Golden Sample','critical'],
      ['Spec đo (POM) sai lệch trong tolerance bảng đo','POM measurements within tolerance','major'],
      ['Mật độ mũi chỉ đúng (SPI), đường may thẳng, đều','Stitch density (SPI) per spec, seams straight','major'],
      ['Bartack tại stress point đạt yêu cầu','Bartacks at stress points adequate','major'],
      ['Mép cắt sạch, không sổ tua','Cut edges clean, no fraying','minor'],
    ]},
    { lbl:'Điều kiện xưởng', lblEn:'Factory Conditions', items:[
      ['Xưởng tuân thủ social compliance (no child labor)','Factory meets social compliance (no child labor)','critical'],
      ['Máy may đặt thông số đúng cho từng SKU','Sewing machines set correctly per SKU','major'],
      ['Khu cắt riêng với khu may, kiểm soát panel theo lot','Cutting separated from sewing, panels by lot','minor'],
    ]},
  ],

  shoes: [
    { lbl:'Upper material', lblEn:'Upper Material', items:[
      ['Không chứa Chromium VI, AZO dye, PCP, DMF vượt EU REACH/CPSIA','No Chromium VI, AZO dye, PCP, DMF above EU REACH/CPSIA','critical'],
      ['Da/PU/textile đúng loại, độ dày, độ bền theo spec','Leather/PU/textile correct type and thickness per spec','critical'],
      ['Màu sắc đúng mẫu Pantone đã duyệt','Color matches approved Pantone','major'],
      ['Bề mặt không có vết nứt, lỗ thủng, vết bẩn cố định','Surface free of cracks, holes, permanent stains','major'],
      ['Độ bền màu khi cọ xát ≥4 (grayscale)','Color fastness on rubbing ≥4','major'],
      ['Số lượng đủ cho lô + dự phòng 5%','Sufficient qty + 5% spare','minor'],
    ]},
    { lbl:'Sole, midsole & lining', lblEn:'Sole, Midsole & Lining', items:[
      ['Đế ngoài (outsole) chống trượt đạt chuẩn EN ISO 13287','Outsole slip-resistance per EN ISO 13287','critical'],
      ['Đế đúng chất liệu, độ cứng Shore A theo spec','Sole correct material, Shore A hardness per spec','major'],
      ['Lining vải không phai khi tiếp xúc mồ hôi','Lining fabric does not bleed on sweat contact','major'],
      ['Màu đế khớp mẫu, không pha tạp lô khác','Sole color matches sample, no lot contamination','minor'],
    ]},
    { lbl:'Mẫu đầu dây chuyền', lblEn:'First-off Sample', items:[
      ['Mẫu đầu khớp Golden Sample về form, color, sole pattern','First-off matches Golden Sample','critical'],
      ['Test kéo bong upper-sole đạt ≥3.5 N/mm','Upper-sole peel test ≥3.5 N/mm','critical'],
      ['L/R đối xứng — đo chiều dài, chiều cao bằng nhau','L/R symmetric — equal length and height','major'],
      ['Đường may upper thẳng, đều, không bỏ mũi','Upper stitching straight, even, no skipped stitches','minor'],
    ]},
    { lbl:'Keo dán & last (phom)', lblEn:'Adhesive & Last', items:[
      ['Keo dán không chứa benzene, toluene vượt giới hạn','Adhesive free of benzene, toluene above limits','critical'],
      ['Phom (last) đúng size grading, đối xứng L/R','Last correct size grading, L/R symmetric','major'],
      ['Keo còn hạn sử dụng, lưu trữ đúng nhiệt độ','Adhesive within shelf life, stored at correct temperature','minor'],
    ]},
  ],

  fashion: [
    { lbl:'Vật liệu chính', lblEn:'Main Materials', items:[
      ['Không chứa Chromium VI, AZO dye, formaldehyde vượt giới hạn EU/US','No Chromium VI, AZO dye, formaldehyde above EU/US limits','critical'],
      ['Vật liệu chính đúng spec về độ dày, độ bền','Main material correct thickness and durability per spec','critical'],
      ['Màu sắc đúng Pantone đã duyệt — kiểm tra dưới D65','Color matches approved Pantone under D65','major'],
      ['Bề mặt nguyên liệu không trầy xước, rách, ố','Material surface free of scratches, tears, stains','major'],
      ['Hoa văn/print không lệch tâm, không phai','Pattern/print not off-center, not fading','major'],
      ['Số lượng đủ lô + dự phòng 5%','Material qty sufficient + 5% spare','minor'],
    ]},
    { lbl:'Hardware (khóa, zipper, móc, đinh tán)', lblEn:'Hardware', items:[
      ['Hardware không nickel release vượt 0.5 µg/cm²/tuần','Hardware nickel release ≤0.5 µg/cm²/week','critical'],
      ['Hardware không chứa chì >90 ppm (CPSIA)','Hardware lead ≤90 ppm (CPSIA)','critical'],
      ['Khóa/zipper test pull ≥100N không hỏng','Lock/zipper pull test ≥100N without failure','major'],
      ['Bề mặt hardware không rỉ, không xước, mạ đều','Hardware no rust, no scratches, even plating','major'],
    ]},
    { lbl:'Mẫu đầu dây chuyền', lblEn:'First-off Sample', items:[
      ['Mẫu đầu khớp Golden Sample 100%','First-off 100% matches Golden Sample','critical'],
      ['Kích thước/form đúng spec ±3mm','Dimensions/shape per spec ±3mm','major'],
      ['Khóa/zipper hoạt động trơn tru, không kẹt','Lock/zipper operates smoothly','major'],
      ['Logo embossing/print rõ nét, không lệch','Logo embossing/print sharp, centered','minor'],
    ]},
  ],

  craft: [
    { lbl:'Nguyên vật liệu thô', lblEn:'Raw Materials', items:[
      ['Vật liệu đúng loại theo spec (mây, tre, cói, gốm, sơn mài...)','Materials correct type per spec','critical'],
      ['Không sử dụng sơn chì, hóa chất độc — đặc biệt SP cho trẻ em','No lead paint, toxic chemicals — esp. for kids products','critical'],
      ['Sơn/coating đạt EN71-3 nếu XK EU','Paint/coating meets EN71-3 if EU export','critical'],
      ['Vật liệu đã sấy/xử lý chống mọt — fumigation cert','Material kiln-dried/treated — fumigation cert','critical'],
      ['Độ ẩm vật liệu tự nhiên ≤15% (mây/tre/cói)','Natural material moisture ≤15%','major'],
      ['Không có mốc, đốm đen, mục trên vật liệu thô','No mold, dark spots, rot on raw material','major'],
      ['Số lượng nguyên liệu đủ cho cả lô + dự phòng 10%','Material qty sufficient + 10% spare','minor'],
    ]},
    { lbl:'Mẫu đầu sản xuất', lblEn:'First-off Production', items:[
      ['Mẫu đầu khớp Golden Sample về hình dáng, họa tiết, kỹ thuật đan','First-off matches Golden Sample on shape, pattern, weaving','critical'],
      ['Kỹ thuật sơn/phủ/dán đạt yêu cầu thẩm mỹ','Painting/coating meets aesthetic requirements','major'],
      ['Mối nối, dán keo chắc — test giật nhẹ không tuột','Joints/gluing secure — passes light pull test','major'],
      ['Kích thước trong tolerance handmade (±5mm)','Dimensions within handmade tolerance (±5mm)','minor'],
    ]},
    { lbl:'Điều kiện xưởng', lblEn:'Workshop Conditions', items:[
      ['Xưởng tuân thủ social compliance (no child labor)','Workshop meets social compliance','critical'],
      ['Khu sơn/lacquer có thông gió tốt, PPE đầy đủ','Paint/lacquer area well-ventilated, PPE provided','major'],
      ['Kho khô ráo, tránh ẩm mốc cho NL tự nhiên','Warehouse dry, prevents mold on natural materials','major'],
    ]},
  ],

  agri: [
    { lbl:'Nguyên liệu thô đầu vào', lblEn:'Raw Material Input', items:[
      ['Có COA pesticide test — dư lượng dưới MRL thị trường XK','Has pesticide COA — residues below export market MRL','critical'],
      ['Có COA aflatoxin — B1 ≤5 µg/kg, total ≤10 µg/kg (EU)','Has aflatoxin COA — B1 ≤5, total ≤10 µg/kg (EU)','critical'],
      ['Có COA heavy metals (Pb, Cd, As, Hg) trong ngưỡng','Has heavy metals COA within limit','critical'],
      ['Test microbiology (E.coli, Salmonella) âm tính','Microbiology test (E.coli, Salmonella) negative','critical'],
      ['Độ ẩm đúng spec: cà phê ≤12.5%, gia vị ≤10%, hạt điều ≤5%','Moisture per spec: coffee ≤12.5%, spice ≤10%, cashew ≤5%','critical'],
      ['Không có côn trùng sống, mảnh kim loại, đá nhìn thấy','No live insects, metal pieces, visible stones','critical'],
      ['Mùi đặc trưng đúng, không mùi mốc/hóa chất','Characteristic aroma correct, no mold/chemical odor','major'],
      ['Tạp chất hữu cơ (vỏ, lá) ≤2% theo trọng lượng','Organic foreign matter ≤2% by weight','major'],
      ['Bao bì NL không rách, không thấm ẩm','RM packaging intact, moisture-proof','minor'],
    ]},
    { lbl:'Thiết bị & vệ sinh nhà máy', lblEn:'Equipment & Plant Hygiene', items:[
      ['Nhà máy có chứng nhận HACCP/ISO 22000 còn hiệu lực','Plant has valid HACCP/ISO 22000','critical'],
      ['Quy trình ngăn nhiễm chéo allergen được triển khai','Allergen cross-contamination prevention implemented','critical'],
      ['Detector kim loại hoạt động, được verify đầu ca','Metal detector functional, verified at shift start','major'],
      ['Kho NL kiểm soát nhiệt độ/độ ẩm theo spec','RM warehouse temperature/humidity controlled per spec','major'],
      ['Khu vực SX sạch, không có côn trùng, gián chuột','Production area clean, no insects, rodents','major'],
    ]},
  ],
},

// ============================================================
// PHASE 2: DUPRO
// ============================================================
dupro: {
  wood: [
    { lbl:'Workmanship & độ chính xác gia công', lblEn:'Workmanship & Machining', items:[
      ['Mộng ghép, ốc vít liên kết chắc — không lung lay','Joints/screws secure — no wobble under force','critical'],
      ['Không có gỗ mục, nứt xuyên, mọt phát hiện trên WIP','No rot, through-cracks, insect damage on WIP','critical'],
      ['Kích thước chi tiết đúng bản vẽ (sai lệch ≤±1.5mm)','Component dimensions per drawing (tolerance ≤±1.5mm)','major'],
      ['Bề mặt sau gia công phẳng, không cong vênh quá 2mm/1m','Surface flat, warp ≤2mm/m','major'],
      ['Sơn/lacquer lớp đầu đều, không bọng khí, không chảy','First paint coat even, no bubbles, no runs','major'],
      ['Không có cạnh sắc, ba via tại các điểm gia công','No sharp edges or burrs at processing points','minor'],
      ['Lô NG được tách riêng, không trộn với good','NG lot separated, not mixed with good','critical'],
      ['Tỷ lệ rework ≤5%','Rework rate ≤5%','major'],
      ['Tiến độ sản xuất đúng kế hoạch (trễ ≤3 ngày OK)','Production on schedule (≤3 day delay OK)','major'],
    ]},
  ],

  textile: [
    { lbl:'Workmanship may & cắt', lblEn:'Sewing & Cutting Workmanship', items:[
      ['Không phát hiện kim gãy còn sót trong sản phẩm (needle detector)','No broken needle found in product','critical'],
      ['Đường may chính (load-bearing) đạt độ bền kéo theo spec','Main load-bearing seams meet tensile strength','critical'],
      ['Kích thước (POM) đúng size chart, sai lệch ≤±0.5cm','POM measurements per size chart, ≤±0.5cm','major'],
      ['Đường may thẳng, mật độ mũi đều, không bỏ mũi','Seams straight, stitch density even, no skipped stitches','major'],
      ['Phụ liệu (zipper, button, tag) gắn đúng vị trí và chắc','Trims at correct positions and secure','major'],
      ['Chỉ thừa cắt sạch sau mỗi công đoạn','Loose threads trimmed after each stage','minor'],
      ['Không có kim gãy/đinh ghim còn sót','No broken needles/pins remaining','critical'],
      ['Tỷ lệ defect tại dây chuyền ≤3%','In-line defect rate ≤3%','minor'],
    ]},
  ],

  shoes: [
    { lbl:'Workmanship lắp ráp', lblEn:'Assembly Workmanship', items:[
      ['Không phát hiện kim gãy/dị vật trong upper/insole','No broken needle/foreign objects in upper/insole','critical'],
      ['Kết dán upper-sole đạt độ bám — kiểm tra định kỳ peel test','Upper-sole bond — periodic peel test','critical'],
      ['Size đúng từng đôi, 2 chiếc đối xứng (L/R)','Size correct per pair, two shoes symmetric','major'],
      ['Màu sắc đồng đều trong cùng một lot','Color consistent within same lot','major'],
      ['Dây buộc/velcro/khóa hoạt động đúng chức năng','Laces/velcro/buckle function correctly','major'],
      ['Đường may đều SPI, không có mũi bỏ','Stitching even SPI, no skipped stitches','minor'],
      ['Tỷ lệ lỗi tại dây chuyền ≤3%','In-line defect rate ≤3%','major'],
    ]},
  ],

  fashion: [
    { lbl:'Workmanship & lắp ráp', lblEn:'Workmanship & Assembly', items:[
      ['Không phát hiện kim gãy/đinh ghim còn sót','No broken needles/pins found in product','critical'],
      ['Khóa, zipper, móc test hoạt động — không kẹt','Lock, zipper, hook function — no jamming','critical'],
      ['Đường may và dán keo đúng kỹ thuật, đều đặn','Stitching and gluing technically correct','major'],
      ['Hardware gắn chắc — test lực kéo ≥80N','Hardware securely attached — pull test ≥80N','major'],
      ['Bề mặt không lỗi: không trầy, không bẩn, không hở mí','Surface defect-free: no scratches, stains, open seams','major'],
      ['Tỷ lệ rework ≤5%','Rework rate ≤5%','major'],
      ['Điểm gắn quai/dây chịu lực đạt yêu cầu','Strap/handle attachment points pass pull test','critical'],
    ]},
  ],

  craft: [
    { lbl:'Workmanship & kỹ thuật thủ công', lblEn:'Workmanship & Handcraft', items:[
      ['Không có mảnh sắc, kim loại lộ ra trên sản phẩm','No sharp shards or exposed metal on product','critical'],
      ['Mối nối/dán/đan chắc — không bung khi test giật','Joints/glue/weaving secure — no detachment on pull','critical'],
      ['Hình dáng sản phẩm đúng mẫu, tỷ lệ đồng đều','Product shape per sample, proportions consistent','major'],
      ['Sơn/coating phủ đều, không bong tróc khi cào nhẹ','Paint/coating even, no peeling on light scratch','major'],
      ['Màu sắc đồng đều trong lô (biến động nhỏ handmade OK)','Color consistent (minor handmade variation OK)','minor'],
      ['Tiến độ phù hợp đặc thù thủ công, deadline khả thi','Progress appropriate for handmade nature','major'],
    ]},
  ],

  agri: [
    { lbl:'Kiểm soát quá trình chế biến', lblEn:'In-process Quality Control', items:[
      ['Nhiệt độ rang/sấy/thanh trùng đúng quy trình HACCP','Roasting/drying/pasteurization temp per HACCP','critical'],
      ['Detector kim loại verify pass/reject mỗi 2 giờ','Metal detector verified pass/reject every 2 hrs','critical'],
      ['Không phát hiện nhiễm chéo allergen','No allergen cross-contamination detected','critical'],
      ['Mùi đặc trưng đúng — không mùi lạ, mùi cháy khét','Characteristic aroma correct — no foreign or burnt smell','major'],
      ['Độ ẩm thành phẩm trung gian đúng spec','Intermediate moisture content per spec','major'],
      ['Lot trace đầy đủ — biết được nguồn gốc từng batch','Lot trace complete — origin known per batch','major'],
      ['Tiến độ chế biến đúng kế hoạch','Processing on schedule','minor'],
    ]},
  ],
},

// ============================================================
// PHASE 3: FRI/PSI
// ============================================================
fri: {
  wood: [
    { lbl:'Chất lượng vật liệu & ngoại quan', lblEn:'Material Quality & Appearance', items:[
      ['Không có mọt sống/trứng mọt/ấu trùng nhìn thấy','No live insects/eggs/larvae visible','critical'],
      ['Không có nấm mốc nhìn thấy, mùi mốc','No visible mold or moldy smell','critical'],
      ['Sơn không chứa chì, formaldehyde dưới ngưỡng EU/US','Paint lead, formaldehyde under EU/US limits','critical'],
      ['Không có nứt xuyên (through-crack) >30mm','No through-cracks >30mm','major'],
      ['Bề mặt sơn/lacquer đều, không bọng khí, không ố','Paint/lacquer even, no bubbles, no yellowing','major'],
      ['Màu sắc đồng đều trong lô — match swatch duyệt','Color uniform across lot — matches approved swatch','major'],
      ['Kích thước đúng spec, sai lệch ≤±1mm','Dimensions per spec, tolerance ≤±1mm','major'],
      ['Không có cạnh sắc, ba via, đinh lộ','No sharp edges, burrs, exposed nails','major'],
      ['Logo/thương hiệu đúng vị trí, rõ nét','Logo/brand correctly placed and legible','minor'],
    ]},
    { lbl:'Chức năng & độ bền', lblEn:'Function & Durability', items:[
      ['Sản phẩm không sập/gãy khi load test (chairs, tables)','Product does not collapse under load test','critical'],
      ['Liên kết mộng/vít/chốt chắc — không lung lay','Joints/screws secure — no wobble under force','major'],
      ['Ngăn kéo/cửa/bản lề mở đóng trơn tru ≥100 cycles','Drawers/doors/hinges smooth ≥100 cycles','major'],
      ['Chân/đế sản phẩm tiếp xúc nền đều — không lắc','Legs/base contact ground evenly — no rocking','minor'],
    ]},
    { lbl:'Đóng gói & shipping mark', lblEn:'Packaging & Shipping Mark', items:[
      ['Carton/kiện gỗ đủ chắc cho vận chuyển quốc tế','Carton/crate strong enough for international shipping','critical'],
      ['Fumigation certificate (US/EU/AU export) — bắt buộc','Fumigation certificate (US/EU/AU) — mandatory','critical'],
      ['FSC/PEFC certificate hoặc khai báo nguồn gốc gỗ','FSC/PEFC or legal timber origin declaration','critical'],
      ['Foam/PE bảo vệ đủ dày tại 4 góc và bề mặt chính','Foam/PE protection adequate at 4 corners','major'],
      ['Số lượng đúng từng thùng, khớp packing list','Qty per carton correct, matches packing list','major'],
      ['Shipping mark đầy đủ: PO, SKU, qty, weight, destination','Shipping mark complete: PO, SKU, qty, weight, destination','major'],
      ['Silica gel/chống ẩm đủ cho container ≥40 ngày','Moisture protection adequate for ≥40 days','minor'],
    ]},
  ],

  textile: [
    { lbl:'Chất lượng thành phẩm', lblEn:'Finished Product Quality', items:[
      ['Không có kim gãy còn sót (needle detector pass)','No broken needles (needle detector pass)','critical'],
      ['Không chứa AZO dye/formaldehyde/heavy metal vượt giới hạn','No AZO dye/formaldehyde/heavy metal above limits','critical'],
      ['Màu sắc đúng Pantone/lab dip, đồng đều toàn lô','Color matches Pantone/lab dip, uniform across lot','major'],
      ['Kích thước đúng size chart, sai lệch ≤±0.5cm','Dimensions per size chart, tolerance ≤±0.5cm','major'],
      ['Đường may thẳng, mật độ đều, không bỏ mũi','Seams straight, density even, no skipped stitches','major'],
      ['Nhãn size, care label, COO đúng nội dung và vị trí','Size/care/COO labels correct content and position','major'],
      ['Không có chỉ thừa, vụn vải, vết bẩn','No loose threads, fabric scraps, stains','minor'],
    ]},
    { lbl:'Đóng gói', lblEn:'Packaging', items:[
      ['Polybag có warning suffocation (US/EU yêu cầu)','Polybag has suffocation warning (US/EU required)','critical'],
      ['Số lượng/màu/size đúng từng carton theo packing list','Qty/color/size per carton matches packing list','major'],
      ['Shipping mark đầy đủ, đúng quy cách','Shipping mark complete, correct format','major'],
      ['Test report OEKO-TEX/REACH/CPSIA hiệu lực nếu yêu cầu','OEKO-TEX/REACH/CPSIA test report valid if required','critical'],
    ]},
  ],

  shoes: [
    { lbl:'Ngoại quan upper & sole', lblEn:'Upper & Sole Appearance', items:[
      ['Không phát hiện kim gãy/dị vật trong upper/insole','No broken needle/foreign objects in upper/insole','critical'],
      ['Không chứa AZO dye/Chromium VI (bắt buộc cho EU)','No AZO dye/Chromium VI (mandatory for EU)','critical'],
      ['Test report Chromium VI/AZO/PCP/DMF nếu XK EU','Test report Chromium VI/AZO/PCP/DMF for EU export','critical'],
      ['Kết dán upper-sole chắc — bend test 360° không bong','Upper-sole bond secure — 360° bend test no delamination','major'],
      ['Size đúng, 2 chiếc đối xứng hoàn toàn (L/R)','Size correct, pair fully symmetric (L/R)','major'],
      ['Peel test upper-sole đạt ≥3.5 N/mm','Upper-sole peel test ≥3.5 N/mm','critical'],
      ['Polybag có warning suffocation','Polybag has suffocation warning','critical'],
      ['Hộp đúng thông tin: size, màu, SKU, barcode','Box correct: size, color, SKU, barcode','major'],
    ]},
  ],

  fashion: [
    { lbl:'Ngoại quan & chức năng', lblEn:'Appearance & Function', items:[
      ['Không có kim gãy/đinh ghim còn sót','No broken needles/pins remaining','critical'],
      ['Hardware không chứa nickel/chì vượt giới hạn EU/CPSIA','Hardware nickel/lead within EU/CPSIA limits','critical'],
      ['Khóa/zipper/clasp trơn tru sau ≥20 lần thao tác','Lock/zipper/clasp smooth after ≥20 cycles','critical'],
      ['Quai/dây/đai chịu lực test pull đạt ≥80kg','Strap/handle pull test ≥80kg','critical'],
      ['Vật liệu đúng loại, màu đúng mẫu, đồng đều lô','Material correct type, color matches sample, lot consistent','major'],
      ['Bề mặt không lỗi: trầy, bong, bẩn, vết ố','Surface defect-free: scratch, peel, dirt, stain','major'],
      ['Test report REACH/CPSIA/Prop 65 nếu thị trường yêu cầu','REACH/CPSIA/Prop 65 test report if required','critical'],
      ['Polybag có warning suffocation','Polybag has suffocation warning','critical'],
    ]},
  ],

  craft: [
    { lbl:'Chất lượng thành phẩm', lblEn:'Finished Product Quality', items:[
      ['Không có mảnh sắc, gai nhọn lộ thiên — đặc biệt SP cho trẻ em','No sharp shards/spikes — esp. kids products','critical'],
      ['Không sử dụng sơn chì/hóa chất độc — EN71-3 nếu EU','No lead paint/toxic chemicals — EN71-3 for EU','critical'],
      ['Có fumigation cert cho NL tự nhiên (tre/mây/cói)','Fumigation cert for natural materials','critical'],
      ['Test report an toàn hóa chất EN71-3/REACH/CPSIA nếu XK EU/US','Chemical safety test report for EU/US export','critical'],
      ['Sản phẩm đúng mẫu — hình dáng, họa tiết, tỷ lệ','Product matches design: shape, pattern, proportions','major'],
      ['Hoàn thiện bề mặt: không sần sùi, không vết nứt, không bong sơn','Surface: no roughness, cracks, peeling paint','major'],
      ['Màu sắc đúng và đồng đều trong lô','Color correct and consistent across lot','major'],
      ['Silica gel đủ cho NL tự nhiên (chống mốc trong container)','Silica gel sufficient for natural materials','major'],
    ]},
  ],

  agri: [
    { lbl:'Chất lượng thành phẩm', lblEn:'Finished Product Quality', items:[
      ['Có COA đầy đủ: pesticide, aflatoxin, heavy metals, microbiology','Complete COA: pesticide, aflatoxin, heavy metals, microbiology','critical'],
      ['Không có dị vật nguy hiểm: kim loại, thủy tinh, đá lớn','No dangerous foreign matter: metal, glass, large stones','critical'],
      ['Không có côn trùng sống, mốc nhìn thấy','No live insects, visible mold','critical'],
      ['Độ ẩm đúng spec: cà phê ≤12.5%, gia vị ≤10%, hạt điều ≤5%','Moisture per spec: coffee ≤12.5%, spice ≤10%, cashew ≤5%','critical'],
      ['HSD còn đủ thời hạn tối thiểu theo yêu cầu buyer','Remaining shelf life meets buyer minimum','critical'],
      ['COA test report hiệu lực, đúng yêu cầu thị trường','COA test report valid, meets market requirement','critical'],
      ['Health/Phytosanitary Certificate nếu yêu cầu','Health/Phytosanitary Certificate if required','critical'],
      ['Mùi đặc trưng đúng — không mùi mốc, hóa chất','Characteristic aroma — no mold, chemical, or foreign odor','major'],
      ['Nhãn đầy đủ: name, ingredients, allergen, COO, NSX, HSD','Mandatory label: name, ingredients, allergen, COO, MFG, EXP','critical'],
    ]},
  ],
},

// ============================================================
// PHASE 4: CLI — dùng chung cho tất cả ngành
// ============================================================
cli: {
  all: [
    { lbl:'Kiểm tra container trước khi xếp', lblEn:'Pre-loading Inspection', items:[
      ['Container không có lỗ thủng, không thấm dột — light test pass','Container no holes, no leaks — light test pass','critical'],
      ['Container sạch, khô, không mùi hóa chất, không côn trùng','Container clean, dry, no chemical odor, no insects','critical'],
      ['Số container và seal khớp 100% booking confirmation','Container and seal number 100% match booking','critical'],
      ['Sàn container không có vết dầu, hóa chất nhiễm bẩn','Container floor no oil/chemical contamination','major'],
      ['Cửa container hoạt động trơn tru, gasket kín','Container door operates smoothly, gasket sealed','major'],
    ]},
    { lbl:'Xếp hàng vào container', lblEn:'Loading Process', items:[
      ['Số thùng xếp vào container khớp 100% packing list','Number of cartons loaded matches packing list 100%','critical'],
      ['Không trộn lẫn hàng của đơn khác trong cùng container FCL','No mixing with other orders in same FCL container','critical'],
      ['Hàng được xếp đúng quy định safety (không vượt trọng tải)','Goods loaded per safety regulations (no overload)','critical'],
      ['Carton không bị móp/vỡ trong quá trình xếp','Cartons not crushed/damaged during loading','major'],
      ['Xếp hàng đúng hướng (this side up, fragile, do not stack...)','Goods in correct orientation','major'],
      ['Hàng nặng xếp dưới, hàng nhẹ xếp trên','Heavy goods on bottom, light on top','major'],
      ['Chèn lót/airbag/dunnage đủ — hàng không dịch chuyển','Dunnage/airbags sufficient — goods do not shift','major'],
    ]},
    { lbl:'Hoàn tất & niêm phong', lblEn:'Completion & Sealing', items:[
      ['Container được seal đúng quy cách, ghi nhận số seal','Container sealed correctly, seal number recorded','critical'],
      ['Số seal khớp với booking — không có dấu hiệu đã mở','Seal number matches booking — no signs of opening','critical'],
      ['Ảnh chụp container trước khi đóng cửa: toàn cảnh','Container photos before closing','major'],
      ['Shipping mark trên carton mặt cửa nhìn thấy rõ','Shipping mark on door-facing cartons clearly visible','major'],
      ['Tổng trọng lượng container không vượt giới hạn','Container total weight does not exceed limit','major'],
    ]},
  ],
},

// ============================================================
// PHASE 5: POST-DELIVERY — dùng chung
// ============================================================
post: {
  all: [
    { lbl:'Đánh giá sau giao hàng', lblEn:'Post-Delivery Assessment', items:[
      ['Buyer xác nhận nhận đủ hàng, số lượng đúng 100%','Buyer confirmed complete receipt, 100% correct quantity','critical'],
      ['Không có khiếu nại nghiêm trọng về chất lượng/an toàn','No critical quality/safety complaints from buyer','critical'],
      ['Không có sản phẩm trả về do lỗi chất lượng','No products returned due to quality issues','critical'],
      ['Container seal nguyên vẹn khi đến cảng đích','Container seal intact upon arrival at destination','critical'],
      ['Không có hàng hư hỏng trong vận chuyển (>5% lô)','No transit damage exceeding 5% of lot','major'],
      ['Chứng từ giao hàng đầy đủ và đã được ký xác nhận','Delivery documents complete and signed','major'],
      ['Thanh toán được thực hiện đúng điều khoản hợp đồng','Payment executed per contract terms','major'],
      ['Khiếu nại nhỏ (nếu có) được supplier giải quyết kịp thời','Minor complaints resolved by supplier promptly','minor'],
      ['Buyer hài lòng về đóng gói và nhãn mác','Buyer satisfied with packaging and labeling','minor'],
      ['Lessons learned được ghi nhận cho đơn hàng tiếp theo','Lessons learned documented for next order','minor'],
    ]},
  ],
},

}; // end CL

[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

# Loyiha 07. Birinchi avtomatlashtirilgan loop'ingizni qurish

> Bogʻliq maʼruza: [L13. Nega agentingizga prompt yozishni bas qilishingiz kerak](./../../lectures/lecture-13-loop-engineering/index.md)

## Nima qilasiz

Bu "Harness" dan "Loop" ga oʻtish loyihasi. Siz allaqachon agentni toʻgʻri muhit, koʻrsatmalar va fikr-mulohaza bilan oʻrnatishni bilasiz — endi siz oʻsha oʻrnatishni oʻzi ishlaydigan loopʼga aylantirasiz.

Siz uchta progressiv eksperiment qilasiz: avval vazifani qoʻldan `/goal` ga aylantirasiz, keyin kuzatuv vazifasini `/loop` taymeriga aylantirasiz va nihoyat toʻliq maker-checker loopʼini qurib, **siz loop tashqarisiga chiqsangiz** nima his qilishni boshdan kechirasiz.

## Foydalanadigan vositalar

- Claude Code yoki Codex
- Git
- P06 dan sizning toʻliq harnessʼingiz
- Terminal multiplaksatori (tmux yoki screen, uzoq davom etadigan loopʼlarni kuzatish uchun)
- Ixtiyoriy: GitHub Actions yoki cron (rivojlangan event-driven / rejalashtirilgan eksperimentlar uchun)

## Qadamlar

### Tayyorgarlik

1. P06 ni tugatgan xuddi shu commit dan boshlang.
2. Uchta branch yarating: `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Harnessʼingiz ishlashini tasdiqlang: init.sh ni ishga tushiring, holat fayli, funksiyalar roʻyxati va topshirish hujjatlari borligini tekshiring.
4. Loopʼning takroran ishlashi kerak boʻlgan **maqsadli vazifa** ni tanlang. Tugallik mezonlari aniq boʻlgan oʻrtacha kattalikdagi narsani tanlang — masalan, "barcha modullarga unit testlar qoʻshish, 80% qamrovga erishish" yoki "barcha API endpointʼlariga kirishni tekshirishni qoʻshish".

### 1-eksperiment: Goal Loop — Qoʻlda ishlatishdan avtomatik ishlashga

`p07-goal-loop` branchʼiga oʻting.

1. **Maqsad tavsifini yozing**: Tanlagan vazifangizni `goal.md` fayliga aylantiring, quyidagilarni oʻz ichiga olgan holda:
   - Aniq maqsad ("nima tugallangan hisoblanadi")
   - Tekshirish usuli ("tugalligini qanday tasdiqlash kerak" — testlarni ishga tushirishmi? lint ni ishga tushirishmi? qamrovni tekshirishmi?)
   - Toʻxtash sharti ("qachon toʻxtashi kerak" — maksimal turnlar soni? vaqt chegarasi? byudjet chegarasi?)
   - Cheklovlar ("nimaga tegmang" — production konfiguratsiyasi, maʼlumotlar bazasi sxemasi va boshqalar)

2. **Birinchi qoʻlda ishlatish**: Vazifani agentga oʻzingiz qoʻlda bering. Necha turn oʻtganini, necha marta aralashganingizni va natija sifatini yozib oling. Bu sizning bazangiz.

3. **`/goal` bilan ishlatish**: Xuddi shu `goal.md` ni kirish sifatida ishlating va uni `/goal` rejimida ishga tushiring. Agent maqsadga erishgunga qadar yoki toʻxtash sharti ishga tushgunga qadar oʻzi loop qiladi.

4. **Natijalarni solishtiring**:
   - Turnlar sonidagi farq
   - Sizning aralashish soningizdagi farq
   - Natija sifatidagi farq (bir xil tekshirish standartidan foydalanib)
   - Sarflagan vaqtingizdagi farq

5. **goal.md ustida takrorlang**: Agar natijalar yomon boʻlsa, maqsad tavsifini qayta koʻrib chiqing va yana ishlating. Natijalardan qoniqmaganingizgacha yoki goal loop ushbu vazifada qila oladigan chegarasini tasdiqlaguningizgacha davom eting.

### 2-eksperiment: Taymer Loop — Kuzatuvni yurak urishiga aylantiring

`p07-timer-loop` branchʼiga oʻting.

1. **Kuzatuv vazifasini tanlang**: Odatda qoʻlda qilgan takroriy tekshiruvni toping. Masalan:
   - Har soat test toʻplamini ishga tushiring, xatolarni tuzating
   - Har ertalab bogʻliqlik xavfsizlik yangilanishlarini tekshiring
   - Har bir commit dan keyin kodlash uslubi buzilishlarini tekshiring
   - Vaqti-vaqti bilan TODO izohlarini skanerlab, qaysilari eskirganini koʻring

2. **Kuzatuv prompt/skriptini yozing**: Kuzatuv qadamlari aniq belgilang — nima tekshirilishi kerak, muammolar topilsa nima qilish kerak va qachon insonga murojaat qilish kerak.

3. **`/loop` (yoki Codex Thread automation) bilan ishlatish**:
   - Oʻrtacha interval oʻrnating (10-30 daqiqa tavsiya etiladi — juda qisqa boʻlsa bezovta qilasiz, juda uzoq boʻlsa taʼsirini koʻrmaysiz)
   - Kamida 2 soat davom ettiring (yoki boshqa narsa qilib, keyinroq qayting)

4. **Natijalarni yozing**:
   - Necha muammo topdi?
   - Nechtasini oʻzi tuzatdi?
   - Nechtasi notoʻgʻri musbat edi?
   - Nechtasini yomonlashtirdi?
   - Natijalarini kuzatib qancha vaqt sarfladingiz?

5. **Oʻylab koʻring**: Ushbu kuzatuv vazifasini avtomatlashtirish arzimaydimi? Sertaratgan vaqtni kuzatib sarflagan vaqt bilan solishtiring. Agar arziymasa — notoʻgʻri vazifani tanladingizmi, yoki loop yomon loyihalanganmi?

### 3-eksperiment: Maker-Checker Loop — Oʻzingizni loop dan tashqariga chiqaring

`p07-maker-checker` branchʼiga oʻting.

Bu uchta eksperimentning eng muhimi. Siz **sizning ishtirokingizni talab qilmaydigan toʻliq loop** qurishingiz kerak:

1. **Loop tuzilishini loyihalang**:
   - **Maker agent**: implement qiladi, kod yozadi, fayllarni oʻzgartiradi
   - **Checker agent**: tekshiradi, testlarni ishga tushiradi, kod koʻrib chiqishni amalga oshiradi, oʻtkazadi / muvaffaqiyatsizlikka uchratadi
   - **Holat fayli** (`loop-state.md`): joriy raund, nima qilingan, tekshiruv natijalari, keyin nima qilish kerakligini yozib boradi
   - **Toʻxtash sharti**: N ta ketma-ket oʻtish yoki maksimal raundlar soniga yetish

2. **Uchta prompt yozing**:
   - Maker yoʻriqnomalari (nima qilish kerak, qanday qilish kerak, nimaga tegmang)
   - Checker yoʻriqnomalari (nima tekshirilishi kerak, qanday tekshirilishi kerak, nima oʻtish hisoblanadi, qanday fikr-mulohaza berish kerak)
   - Loop boshqaruv mantiqi (kim birinchi boʻladi, topshirish qanday ishlaydi, keyingi raundni qanday boshlash kerak)

3. **Kamida 5 ta raund ishlating**:
   - 1-raund: Maker implement qiladi → Checker tekshiradi → Muvaffaqiyatsizlik → Makerʼga fikr-mulohaza
   - 2-raund: Maker fikr-mulohaza asosida qayta ishlaydi → Checker tekshiradi → ...
   - ...
   - Ketma-ket oʻtgunga qadar yoki siz chaqirgunga qadar

4. **Har bir raund holatini yozing**:
   - Raund raqami
   - Maker nima qildi
   - Checker qanday muammolar topdi
   - Oʻtdi / yiqildi
   - Siz aralashdingizmi? (agar ha, nega?)

5. **Yakuniy retro**:
   - Nechi marta aralashdingiz? Nega?
   - Agar aralashmasangiz nima boʻlar edi?
   - Checker hech qanday muammoni oʻtkazib yubordimi?
   - Maker bir xil xatoni qayta-qayta qildimi?
   - Ushbu loop ning sifat shifoni qayerda? Maker qobiliyati yoki Checker qobiliyati?

## Natijalarni qanday oʻlchash kerak

| Metrika | 1-eksperiment (Goal) | 2-eksperiment (Taymer) | 3-eksperiment (Maker-Checker) |
|---------|---------------------|----------------------|-------------------------------|
| Vazifani bajarish darajasi | Maqsadga erishildimi? | Necha kuzatuv davri ishladi? | Oʻtguncha necha raund? |
| Inson aralashuvi | Nechi marta aralashdingiz? | Kuzatib qancha vaqt sarfladingiz? | Nechi marta aralashdingiz? |
| Natija sifati | Qoʻlda qilish bilan qanday solishtiriladi? | Notoʻgʻri musbat darajasi? Oʻtkazilgan muammolar? | Checker siz topmaganingizda necha muammo topdi? |
| Sertaratgan vaqt | Necha vaqt sertaradingiz? | Avtomatlashtirish arzimaydimi? | Loop loyihalashga sarflangan vaqt sertaratgan vaqtga nisbatan |
| Ishonchlilik | Toʻxtash sharti ishonchli edi? | U qochib kettdimi? | Loop bir joyda tiqilib qolishi mumkinmi? |

## Nima topshirish kerak

- `goal.md` (1-eksperimentning maqsad tavsifi, kamida ikki iteratsiya)
- 1-eksperimentning taqqoslash eslatmalari: qoʻlda vs goal loop
- 2-eksperimentning kuzatuv promptʼi + 2 soatlik ishlash jurnali
- 3-eksperimentning uchta promptʼi (Maker / Checker / Loop boshqaruv)
- 3-eksperimentning `loop-state.md` (kamida 5 ta raund yozilgan)
- Yakuniy retro: barcha uchta eksperimentdan olingan darsliklar, loop muhandisligi haqidagi tushunchangiz qanday oʻzgardi, qanday narsalar loopʼlashtirish uchun yaxshi nomzod va qaysilari emas

## Bogʻliq maʼruzalar

- [13-maʼruza — Nega agentingizga prompt yozishni bas qilishingiz kerak](../../lectures/lecture-13-loop-engineering/index.md)
- [12-maʼruza — Nega har bir sessiya toza holat qoldirishishi kerak](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (loop ning har bir raundi toza holatni talab qiladi)
- [11-maʼruza — Nega kuzatuvchanlik harness ichida boʻlishi kerak](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (loop ichida nima boʻlayotganini koʻrish kerak)
- [5-maʼruza — Nega holat fayllari uzluksizlikning umurtqasi hisoblanadi](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (loop holat fayllari holat fayllarining kengaytmasidir)

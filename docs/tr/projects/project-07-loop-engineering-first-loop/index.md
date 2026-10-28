[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

> İlgili Ders: [L13. Ajanınızı prompt etmeyi neden bırakmanız gerekir](./../../lectures/lecture-13-loop-engineering/index.md)

# Proje 07. İlk Otomatik Loop'unuzu Oluşturun

## Ne Yapacaksınız

Bu, "Harness"tan "Loop"a geçiş projesidir. Bir ajanı uygun ortam, talimatlar ve geri bildirimle nasıl kuracağınızı zaten biliyorsunuz — şimdi o kurulumu kendi kendine çalışan bir loop'a dönüştüreceksiniz.

Üç ilerici deney yapacaksınız: önce bir görevi manuelden `/goal`'a dönüştüreceksiniz, sonra bir izleme görevini `/loop` zamanlayıcısına dönüştüreceksiniz ve son olarak **loop'un dışına çıktığınızda** ne hissettiğini deneyimlemek için tam bir maker-checker loop'u oluşturacaksınız.

## Kullanacağınız Araçlar

- Claude Code veya Codex
- Git
- P06'dan tamamlanmış harness'ınız
- Bir terminal çoklayıcı (uzun süreli loop'ları izlemek için tmux veya screen)
- İsteğe bağlı: GitHub Actions veya cron (gelişmiş olay odaklı / planlanan deneyler için)

## Adımlar

### Hazırlık

1. P06'ı bitirdiğiniz aynı commit'ten başlayın.
2. Üç dal oluşturun: `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Harness'ınızın çalıştığını doğrulayın: init.sh'ı çalıştırın, durum dosyası, özellik listesi ve devir dokümanlarının hepsinin yerinde olduğunu doğrulayın.
4. Loop'un tekrar tekrar çalışacağı bir **hedef görev** seçin. Net tamamlama kriterleri olan orta ölçekli bir şey seçin — örneğin "tüm modüllere birim testleri ekle, %80 kapsama ulaş" veya "tüm API uç noktalarına giriş doğrulaması ekle."

### Deney 1: Hedef Loop'u — Manuel Çalıştırmadan Otomatik Çalıştırmaya

`p07-goal-loop` dalına geçin.

1. **Hedef açıklamasını yazın**: Seçtiğiniz görevi şunları içeren bir `goal.md` dosyasına dönüştürün:
   - Açık hedef ("bitti olarak ne sayılır")
   - Doğrulama yöntemi ("bittiğini nasıl onaylarsınız" — testleri çalıştırmak mı? lint çalıştırmak mı? kapsamayı kontrol etmek mi?)
   - Durdurma koşulu ("ne zaman durmalı" — maksimum tur sayısı mı? süre sınırı mı? bütçe sınırı mı?)
   - Kısıtlamalar ("neye dokunulmamalı" — üretim yapılandırması, veritabanı şeması vb.)

2. **İlk manuel çalıştırma**: Görevi ajana kendiniz manuel olarak verin. Kaç tur sürdüğünü, kaç kez müdahale ettiğinizi ve sonuç kalitesini kaydedin. Bu sizin taban çizginiz.

3. **`/goal` ile çalıştırın**: Aynı `goal.md`'yi girdi olarak kullanın ve `/goal` modunda çalıştırın. Ajan hedefe ulaşılana veya durdurma koşulu tetiklenene kadar kendi kendine döner.

4. **Sonuçları karşılaştırın**:
   - Tur sayısındaki fark
   - Müdahale sayınızdaki fark
   - Sonuç kalitesindeki fark (aynı doğrulama standardını kullanarak)
   - Harcadığınız zamandaki fark

5. **goal.md üzerinde yineleme yapın**: Sonuçlar zayıfsa, hedef açıklamasını revize edin ve tekrar çalıştırın. Sonuçlardan memnun kalana kadar veya bir hedef loop'un bu görevde yapabileceklerinin sınırını doğrulayana kadar devam edin.

### Deney 2: Zamanlayıcı Loop'u — İzlemeyi Kalp Atışına Dönüştürün

`p07-timer-loop` dalına geçin.

1. **Bir izleme görevi seçin**: Normalde manuel olarak yaptığınız tekrarlayan bir kontrol bulun. Örneğin:
   - Her saatte test paketini çalıştır, başarısızlıkları düzelt
   - Her sabah bağımlılık güvenlik güncellemelerini kontrol et
   - Her commit'ten sonra kodlama stili ihlallerini kontrol et
   - Periyodik olarak TODO yorumlarını tara, hangilerinin bayat olduğunu gör

2. **İzleme prompt'unu/betiğini yazın**: İzleme adımlarını net bir şekilde ortaya koyun — ne kontrol edilecek, sorunlar bulunduğunda ne yapılacak ve ne zaman bir insan çağrılacak.

3. **`/loop` (veya Codex Thread otomasyonu) ile çalıştırın**:
   - Mantıklı bir aralık ayarlayın (10-30 dakika önerilir — çok kısa olursa rahatsız olursunuz, çok uzun olursa etkiyi görmezsiniz)
   - En az 2 saat çalışmasına izin verin (veya başka bir şey yapıp sonra geri dönün)

4. **Sonuçları kaydedin**:
   - Kaç sorun buldu?
   - Kaç tanesini kendi kendine düzeltti?
   - Kaç tanesi yanlış pozitifti?
   - Kaç tanesini daha da kötüleştirdi?
   - Sonuçlarını takip etmek için ne kadar zaman harcadınız?

5. **Düşünün**: Bu izleme görevi otomatikleştirilmeye değer mi? Kazandığınız zaman ile takip etmek için harcadığınız zamanı karşılaştırın. Değerli değilse, yanlış mı görev seçtiniz yoksa loop mu kötü tasarlandı?

### Deney 3: Maker-Checker Loop'u — Kendinizi Loop'un Dışına Çıkarın

`p07-maker-checker` dalına geçin.

Bu, üç deneyin en önemlisidir. **Orada olmanıza gerek kalmayan tam bir loop** oluşturacaksınız:

1. **Loop yapısını tasarlayın**:
   - **Maker ajanı**: uygular, kod yazar, dosyaları değiştirir
   - **Checker ajanı**: doğrular, testleri çalıştırır, kod incelemesi yapar, geçer / başarısız
   - **Durum dosyası** (`loop-state.md`): mevcut turu, ne yapıldığını, doğrulama sonuçlarını, sırada ne olduğunu kaydeder
   - **Durdurma koşulu**: N ardışık geçiş veya maksimum tur sayısına ulaşma

2. **Üç prompt yazın**:
   - Maker talimatları (ne yapmak, nasıl yapmak, neye dokunmamak)
   - Checker talimatları (ne doğrulamak, nasıl doğrulamak, geçer ne sayılır, nasıl geri bildirim vermek)
   - Loop kontrol mantığı (kim önce gider, devir nasıl çalışır, bir sonraki tura nasıl başlanır)

3. **En az 5 tur çalıştırın**:
   - Tur 1: Maker uygular → Checker doğrular → Başarısız → Maker'a geri bildirim
   - Tur 2: Maker geri bildirime göre revize eder → Checker doğrular → ...
   - ...
   - Ardışık geçişe kadar veya siz durdurana kadar

4. **Her turun durumunu kaydedin**:
   - Tur numarası
   - Maker ne yaptı
   - Checker hangi sorunları buldu
   - Geçer / başarısız
   - Müdahale ettiniz mi? (eğer evetse, neden?)

5. **Nihai retro**:
   - Kaç kez müdahale ettiniz? Neden?
   - Müdahale etmeseydiniz ne olurdu?
   - Checker herhangi bir sorunu kaçırdı mı?
   - Maker aynı hatayı yapmaya devam etti mi?
   - Bu loop'un kalite tavanı nerede? Maker yeteneği mi, yoksa Checker yeteneği mi?

## Sonuçlar Nasıl Ölçülür

| Metrik | Deney 1 (Hedef) | Deney 2 (Zamanlayıcı) | Deney 3 (Maker-Checker) |
|--------|-------------|--------------|----------------------|
| Görev tamamlama oranı | Hedefinize ulaşıldı mı? | Kaç izleme döngüsü çalıştı? | Geçene kadar kaç tur? |
| İnsan müdahaleleri | Kaç kez araya girdiniz? | Sonuçları takip etmek için ne kadar zaman harcadınız? | Kaç kez müdahale ettiniz? |
| Sonuç kalitesi | Manuel olana göre nasıl? | Yanlış pozitif oranı? Kaçırılan sorunlar? | Checker sizin bulamayacağınız kaç sorun buldu? |
| Kazanılan zaman | Ne kadar zaman kazandınız? | Otomatikleştirmeye değer mi? | Loop'u tasarlamak için harcanan zaman vs. kazanılan zaman |
| Güvenilirlik | Durdurma koşulu güvenilir miydi? | Kontrolden çıktı mı? | Loop aynı yerde takılıp kalabilir mi? |

## Neler Teslim Edilecek

- `goal.md` (Deney 1'in hedef açıklaması, en az iki yineleme)
- Deney 1 karşılaştırma notları: manuel vs hedef loop'u
- Deney 2 izleme prompt'u + 2 saatlik çalışma günlüğü
- Deney 3'ün üç prompt'u (Maker / Checker / Loop kontrolü)
- Deney 3'ün `loop-state.md` (en az 5 tur kaydedilmiş)
- Nihai retro: tüm üç deneyden çıkarımlar, loop mühendisliği anlayışınız nasıl değişti, hangi şeyler loop-laştırma için iyi adaylar ve hangileri değil

## İlgili Dersler

- [Ders 13 — Ajanınızı prompt etmeyi neden bırakmanız gerekir](../../lectures/lecture-13-loop-engineering/index.md)
- [Ders 12 — Her oturum neden temiz bir durumla bitmeli](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (bir loop'un her turu temiz durum gerekir)
- [Ders 11 — Gözlemlenebilirlik neden harness'ın içinde olmalı](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (loop'un içinde ne olduğunu görmeniz gerekir)
- [Ders 05 — Durum dosyaları neden sürekliliğin omurgasıdır](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (loop durum dosyaları durum dosyalarının bir uzantısıdır)

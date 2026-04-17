# 2. Background 15

OK

---

# 1. Introduction 1

markdown
Kodu kopyala
# 1. Introduction

## 1.1 Amaç ve Kapsam

Bu dokümanın amacı, ele alınan sistemin / çalışmanın temel çerçevesini tanımlamak, okuyucuya **neden bu konuya ihtiyaç duyulduğunu**, **hangi problemleri hedeflediğini** ve **hangi sınırlar içinde ele alındığını** net biçimde aktarmaktır.  
Introduction (Giriş) bölümü, teknik dokümantasyonun geri kalanının doğru anlaşılması için bağlam (context) oluşturur.

Bu bölümde:
- Problemin tanımı
- Motivasyon
- Hedef kitle
- Varsayımlar ve kısıtlar
yüksek seviyede ele alınır.

---

## 1.2 Problem Tanımı

Modern sistemlerde karmaşıklık; artan veri hacmi, çoklu entegrasyonlar ve yüksek erişilebilirlik gereksinimleriyle hızla artmaktadır. Bu karmaşıklık aşağıdaki sorunlara yol açar:

- Sistemlerin anlaşılabilirliğinin azalması  
- Dokümantasyon eksikliği nedeniyle bilgi kaybı  
- Bakım ve geliştirme maliyetlerinin yükselmesi  

Bu doküman, bu sorunları azaltmak için **yapısal ve teknik olarak tutarlı bir referans** oluşturmayı hedefler.

---

## 1.3 Motivasyon

Bir sistem ne kadar iyi kodlanmış olursa olsun, aşağıdaki durumlar varsa sürdürülebilir değildir:

- Tasarım kararları yazılı değilse  
- Varsayımlar açıkça belirtilmemişse  
- Yeni gelen geliştiriciler için öğrenme eğrisi çok dikse  

Bu nedenle Introduction bölümü, “neden böyle yaptık?” sorusunun ilk cevabını verir.

> İyi bir giriş bölümü, kötü yazılmış 20 sayfalık teknik detaydan daha değerlidir.

---

## 1.4 Hedef Kitle

Bu doküman aşağıdaki profiller için hazırlanmıştır:

- Yazılım geliştiriciler  
- Sistem mimarları  
- Teknik liderler  
- İlgili akademik veya endüstriyel araştırmacılar  

Her teknik terim, i

---

# Acronyms xv

markdown
Kodu kopyala
# 1. Introduction

## 1.1 Amaç ve Kapsam

Bu dokümanın amacı, ele alınan sistemin / çalışmanın temel çerçevesini tanımlamak, okuyucuya **neden bu konuya ihtiyaç duyulduğunu**, **hangi problemleri hedeflediğini** ve **hangi sınırlar içinde ele alındığını** net biçimde aktarmaktır.  
Introduction (Giriş) bölümü, teknik dokümantasyonun geri kalanının doğru anlaşılması için bağlam (context) oluşturur.

Bu bölümde:
- Problemin tanımı
- Motivasyon
- Hedef kitle
- Varsayımlar ve kısıtlar
yüksek seviyede ele alınır.

---

## 1.2 Problem Tanımı

Modern sistemlerde karmaşıklık; artan veri hacmi, çoklu entegrasyonlar ve yüksek erişilebilirlik gereksinimleriyle hızla artmaktadır. Bu karmaşıklık aşağıdaki sorunlara yol açar:

- Sistemlerin anlaşılabilirliğinin azalması  
- Dokümantasyon eksikliği nedeniyle bilgi kaybı  
- Bakım ve geliştirme maliyetlerinin yükselmesi  

Bu doküman, bu sorunları azaltmak için **yapısal ve teknik olarak tutarlı bir referans** oluşturmayı hedefler.

---

## 1.3 Motivasyon

Bir sistem ne kadar iyi kodlanmış olursa olsun, aşağıdaki durumlar varsa sürdürülebilir değildir:

- Tasarım kararları yazılı değilse  
- Varsayımlar açıkça belirtilmemişse  
- Yeni gelen geliştiriciler için öğrenme eğrisi çok dikse  

Bu nedenle Introduction bölümü, “neden böyle yaptık?” sorusunun ilk cevabını verir.

> İyi bir giriş bölümü, kötü yazılmış 20 sayfalık teknik detaydan daha değerlidir.

---

## 1.4 Hedef Kitle

Bu doküman aşağıdaki profiller için hazırlanmıştır:

- Yazılım geliştiriciler  
- Sistem mimarları  
- Teknik liderler  
- İlgili akademik veya endüstriyel araştırmacılar  

Her teknik terim, i

---

# 4. Efficient k-Nearest Neighbour Approach Based on Various-Widths

Efficient k-Nearest Neighbour Approach Based on Various-Widths Clustering (kNNVWC) — Kapsamlı Teknik Dökümantasyon

Amaç: Büyük ölçekli veri kümelerinde (ve özellikle yüksek boyutta) tam (exact) k-NN aramasını hızlandırmak için, veriyi tek bir sabit “küme genişliği” ile bölmek yerine, her bölgenin yoğunluğuna göre farklı (çeşitli) genişliklerde hiyerarşik/özyinelemeli kümeler üretmek ve sorgu sırasında üçgen eşitsizliği ile aday kümeleri agresif biçimde budamak. 
computer.org
+2
ijsdr.org
+2

1) Arka Plan: k-NN Aramasında Neyi “Verimsiz” Yapan Şey Ne?
1.1 k-NN’in hesap yükü

Bir sorgu noktası 
𝑞
q için veri kümesi 
𝑋
=
{
𝑥
𝑖
}
𝑖
=
1
𝑁
X={x
i
	​

}
i=1
N
	​

 üzerinde klasik k-NN:

Her 
𝑥
𝑖
x
i
	​

 için 
𝑑
(
𝑞
,
𝑥
𝑖
)
d(q,x
i
	​

) hesaplar

En küçük 
𝑘
k tanesini seçer

Bu yaklaşımın maliyeti (mesafe hesapları açısından) yaklaşık:

𝑂
(
𝑁
⋅
𝐶
𝑑
)
(
burada 
𝐶
𝑑
 bir mesafe hesaplama maliyeti
)
O(N⋅C
d
	​

)(burada C
d
	​

 bir mesafe hesaplama maliyeti)

Yüksek boyutta 
𝐶
𝑑
C
d
	​

 büyür (ör. Öklidyen mesafe 
𝑂
(
𝐷
)
O(D)), ayrıca veri büyükse 
𝑁
N baskın olur.

1.2 “İndeksleme” neden zorlaşır? (Boyut laneti)

Birçok uzamsal indeks (kd-tree vb.) yüksek boyutta budama gücünü kaybeder; noktalar “benzer uzaklıkta” görünmeye başlar, bounding bölgeler gevşer.

1.3 kNNVWC’nin temel fikri

kNNVWC, önce veriyi kümelere ayırır ve sorgu anında:

“Bu kümeden sonuç çıkması imkânsız” dediği kümeleri üçgen eşitsizliğiyle eler

Kalan az sayıda küme içinde daha detaylı arama yapar

Bunu yaparken en kritik yenilik: kümeleri tek bir sabit genişlikle değil, veri yoğunluğuna göre farklı genişliklerle (global + yerel) üretmek. 
computer.org
+2
ResearchGate
+2

2) Various-Widths Clustering: “Tek Ebatlı” Değil, “Bölgeye Göre Ebatlanan” Kümeleme

Bu bölüm, yöntemin kalbi.

2.1 Sezgisel benzetme (akılda kalması için)

Veriyi bir şehir gibi düşün:

Sabit genişlik yaklaşımı: Her yere aynı büyüklükte “posta kodu bölgeleri” çizmek. Şehir merkezinde aşırı kalabalık bölge çıkar (çok büyük küme), kırsalda aşırı küçük ve çok sayıda bölge çıkar (çok fazla küme).

Various-widths yaklaşımı: Önce kabaca büyük bölgeler çizip, kalabalık mahalleleri ayrıca daha küçük parçalara bölmek. Böylece her bölge “benzer iş yükü” üretir: ne aşırı kalabalık ne de aşırı parçalı.

Bu sayede hem küme sayısı hem de küme boyutları dengelenir; sorgu sırasında da “mahalle” bazında eleme yapılır.

2.2 Global genişlik → Yerel genişlik (özyinelemeli bölme)

kNNVWC’de kümeleme tipik olarak şu mantıkla anlatılır:

Veri kümesini önce global bir genişlik (
𝑤
𝑔
w
g
	​

) ile kümele

Oluşan her küme için:

Küme çok büyük / heterojen ise → o kümeyi kendi dağılımına uygun yerel bir genişlik (
𝑤
𝑙
𝑜
𝑐
𝑎
𝑙
w
local
	​

) ile tekrar kümele

Bu işlem, kümeler belirli bir kriteri sağlayana kadar sürer (özyineleme)

Bu yaklaşımın, kümeleme süresini azaltma ve kümeleri dengeleme hedefi açıkça vurgulanır. 
ResearchGate
+2
ijsdr.org
+2

2.3 “Genişlik” (width) ne demek?

Uygulamada “width” şu anlama gelecek şekilde tasarlanır:

Bir kümenin yarıçapı / çapı / kapsama eşiği

Bir noktayı kümeye atarken kabul mesafesi

Grid-benzeri veya yoğunluk-temelli bir ölçek parametresi

Önemli olan: her bölgede aynı width’i zorunlu kılmamak.

2.4 Durdurma kriterleri (pratikte neye göre bölmeyi bırakacağız?)

Yaygın kriter tasarımları:

Maksimum küme boyutu: 
∣
𝐶
∣
≤
𝑀
∣C∣≤M

Maksimum yarıçap / çap: 
radius
(
𝐶
)
≤
𝑟
𝑚
𝑎
𝑥
radius(C)≤r
max
	​


Yoğunluk / dağılım ölçütü: varyans, ortalama komşu mesafesi

Maksimum seviye: hiyerarşi derinliği 
≤
𝐿
≤L

Makaledeki/özetlerdeki ana fikir “predefined criteria” olarak geçer; bu kriterler uygulamaya göre somutlanır. 
ResearchGate
+1

3) Sorgu Aşaması: Üçgen Eşitsizliği ile Küme Budama (Pruning)

kNNVWC’nin performans kazancı çoğunlukla burada gelir.

3.1 Küme temsilcisi ve yarıçap

Her küme 
𝐶
C için genellikle şu özetler tutulur:

Merkez/temsilci: 
𝜇
𝐶
μ
C
	​

 (centroid, medoid veya seçilmiş pivot)

Küme yarıçapı:

𝑅
𝐶
=
max
⁡
𝑥
∈
𝐶
𝑑
(
𝜇
𝐶
,
𝑥
)
R
C
	​

=
x∈C
max
	​

d(μ
C
	​

,x)

Bu sayede 
𝑞
q için kümenin en yakın olası mesafesi şu alt sınırla bulunur:

𝐿
𝐵
(
𝑞
,
𝐶
)
=
max
⁡
(
0
,
𝑑
(
𝑞
,
𝜇
𝐶
)
−
𝑅
𝐶
)
LB(q,C)=max(0,d(q,μ
C
	​

)−R
C
	​

)

Ve üst sınır:

𝑈
𝐵
(
𝑞
,
𝐶
)
=
𝑑
(
𝑞
,
𝜇
𝐶
)
+
𝑅
𝐶
UB(q,C)=d(q,μ
C
	​

)+R
C
	​

3.2 Üçgen eşitsizliğiyle eleme mantığı

Elimizde şu değişken olsun:

Şu ana kadar bulunan k. en iyi komşunun mesafesi: 
𝐷
𝑘
D
k
	​

 (dinamik eşik)

Eğer bir küme için:

𝐿
𝐵
(
𝑞
,
𝐶
)
>
𝐷
𝑘
LB(q,C)>D
k
	​


ise bu kümeden hiçbir nokta k-NN listesine giremez → küme tamamen elenir.

Bu “küme bazlı” eleme, nokta bazlı taramaya göre dramatik tasarruf sağlar.

kNNVWC’nin maksimum verim için üçgen eşitsizliğiyle “unlikely clusters” budadığını özellikle vurgulayan kaynaklar vardır. 
ResearchGate
+2
ijsdr.org
+2

3.3 Aday küme seçimi + rafine arama (iki aşamalı tipik akış)

Candidate Generation

Her küme için 
𝑑
(
𝑞
,
𝜇
𝐶
)
d(q,μ
C
	​

) hesapla (çok daha az sayıda)

LB/UB ile küme ele

Refinement

Kalan kümelerin içindeki noktalar için gerçek 
𝑑
(
𝑞
,
𝑥
)
d(q,x) hesapla

k-NN’i güncelle, 
𝐷
𝑘
D
k
	​

 eşiğini daralt

3.4 Neden “Various Widths” pruning’i güçlendirir?

Sabit genişlikte şu iki kötü senaryo oluşur:

Aşırı büyük kümeler → 
𝑅
𝐶
R
C
	​

 büyür → 
𝐿
𝐵
(
𝑞
,
𝐶
)
LB(q,C) gevşer → eleme zorlaşır

Aşırı küçük/çok küme → küme sayısı patlar → 
𝑑
(
𝑞
,
𝜇
𝐶
)
d(q,μ
C
	​

) hesapları artar

Various-widths yaklaşımı 
𝑅
𝐶
R
C
	​

 değerlerini daha “kontrollü” tutup eleme gücünü artırırken, küme sayısını da dengede tutmayı hedefler. 
ResearchGate
+1

4) Algoritma Tasarımı: Veri Yapıları, Sözde Kod, Parametreler
4.1 Saklanan veri yapıları (önerilen)

Her küme düğümü (node) için:

center = 
𝜇
𝐶
μ
C
	​


radius = 
𝑅
𝐶
R
C
	​


children = alt kümeler (özyinelemeli bölündüyse)

points = yaprak düğüm ise ham noktalar

İsteğe bağlı:

pivotDistances (bazı pivot tabanlı bound optimizasyonları)

bounding box (Öklidyen uzayda ek bound)

4.2 Sözde kod: Kümeleme (özyinelemeli)
text
BuildVWCCluster(points P, width w):
    clusters = ClusterWithWidth(P, w)   // global veya local width
    for each cluster C in clusters:
        if StopCriteriaMet(C):
            mark C as leaf
        else:
            w_local = EstimateLocalWidth(C)
            C.children = BuildVWCCluster(C.points, w_local)
            C.points = null  // iç düğümde ham noktayı boşalt (opsiyonel)
    return clusters

4.3 Sözde kod: k-NN sorgu
text
QueryKNN(rootClusters, query q, k):
    best = MaxHeap(size k)  // (distance, point)
    Dk = +inf

    PQ = PriorityQueue(order by LB(q, cluster))  // en umut verici kümeler önce
    push all root clusters with their LB into PQ

    while PQ not empty:
        C = PQ.pop_min_LB()

        if LB(q,C) > Dk:
            continue  // prune cluster completely

        if C is internal:
            for child in C.children:
                compute LB(q,child)
                if LB(q,child) <= Dk:
                    PQ.push(child)
        else:
            for x in C.points:
                d = dist(q,x)
                if best not full:
                    best.push(d,x)
                    if best full: Dk = best.max_distance()
                else if d < Dk:
                    best.replace_max(d,x)
                    Dk = best.max_distance()

    return best points

4.4 Kritik parametreler ve etkileri
(A) 
𝑤
𝑔
w
g
	​

: global width

Büyük seçilirse: az küme, büyük yarıçap → pruning zayıflar

Küçük seçilirse: çok küme → üst seviye hesap yükü artar

(B) StopCriteria

Çok gevşek → yapraklar büyük → refinement pahalı

Çok sıkı → ağaç derinliği ve node sayısı artar

(C) Yerel width kestirimi 
𝑤
𝑙
𝑜
𝑐
𝑎
𝑙
w
local
	​


İyi bir sezgisel:

Küme içi ortalama komşu mesafesi

Küme içi medyan mesafe (outlier’a daha dayanıklı)

Kümeye göre hedeflenen örnek sayısını verecek şekilde adaptif ayar

5) Karmaşıklık ve Performans: Neyi Ne Zaman Kazanır?
5.1 Maliyet bileşenleri

Toplam sorgu maliyeti kabaca:

𝑇
≈
(
#
visited clusters
)
⋅
𝐶
𝑐
𝑒
𝑛
𝑡
𝑒
𝑟
  
+
  
(
#
checked points
)
⋅
𝐶
𝑑
T≈(#visited clusters)⋅C
center
	​

+(#checked points)⋅C
d
	​


𝐶
𝑐
𝑒
𝑛
𝑡
𝑒
𝑟
C
center
	​

: merkez mesafesi maliyeti (genelde 
𝑂
(
𝐷
)
O(D))

𝐶
𝑑
C
d
	​

: nokta mesafesi maliyeti (genelde 
𝑂
(
𝐷
)
O(D))

Amaç: visited cluster ve özellikle checked points sayılarını düşürmek.

5.2 “Exact” olma şartı ve sonuç doğruluğu

Bu yaklaşım (bound’lar doğru tutulduğunda) exact k-NN verebilir; çünkü yalnızca 
𝐿
𝐵
>
𝐷
𝑘
LB>D
k
	​

 olan kümeler elenir ve bu matematiksel olarak güvenlidir (metric mesafe + üçgen eşitsizliği). kNNVWC’nin “efficiently find k-NNs” hedefi bu çerçevede sunulur. 
computer.org
+2
ijsdr.org
+2

5.3 Ne zaman çok işe yarar?

Çok büyük 
𝑁
N

Veri “clusterable” (doğal yoğunluk bölgeleri var)

Mesafe metriği üçgen eşitsizliği sağlıyor (metric)

Sorgular çok sayıda ve online çalışıyor (indeks amortismanı yüksek)

5.4 Ne zaman sınırlı kalır?

Veri tamamen uniform / rastgele: cluster yarıçapları kolay küçülmez

Çok yüksek boyut + uzaklıkların konsantre olması: bound’lar gevşer

Non-metric benzerlikler: üçgen eşitsizliği yok → pruning garantisi zor

6) Kullanım Senaryoları ve Uygulama Desenleri
6.1 Büyük ölçekli sınıflandırma (k-NN classifier)

Senaryo: Görüntü/embedding tabanlı sınıflandırma (ör. yüz tanıma embedding’leri).

Offline: VWC indeksini kur

Online: Her sorgu embedding’i için k-NN bul, majority vote / distance-weighted vote uygula

İpucu: Distance-weighted oy:

𝑦
^
=
arg
⁡
max
⁡
𝑐
∑
𝑖
∈
𝑘
𝑁
𝑁
(
𝑞
)
1
(
𝑦
𝑖
=
𝑐
)
⋅
1
𝑑
(
𝑞
,
𝑥
𝑖
)
+
𝜖
y
^
	​

=arg
c
max
	​

i∈kNN(q)
∑
	​

1(y
i
	​

=c)⋅
d(q,x
i
	​

)+ϵ
1
	​

6.2 Anomali tespiti (k-NN distance / density)

k-NN tabanlı anomali skorları (örn. LOF benzeri yaklaşımlar) için en pahalı adım k-NN’dir. kNNVWC tipi hızlandırma, çok sorgulu anomali taramalarında ciddi kazanç sağlar. (Yöntemin SCADA güvenliği / anomali tespiti bağlamında bölüm başlığı olarak işlendiği kaynaklar mevcut.) 
content.e-bookshelf.de
+2
Wiley Online Library
+2

6.3 k-NN regression (özellikle çok sorgu)

Özellikle “her yeni veri geldiğinde tekrar tahmin” yapılan sistemlerde (zaman serisi, sensör verisi), k-NN regression tekrar tekrar k-NN çağırır. Kümelerle pruning, toplam maliyeti düşürür. 
PMC

6.4 Kural tabanlı filtre + exact k-NN hibriti

Önce basit bir filtre (ör. zaman penceresi, coarse hashing), sonra kNNVWC ile exact tarama:

Aday havuzunu küçült

Hala exact kalmak istersen filtreyi “güvenli” tasarla (yanlış eleme yapmasın)

7) Avantajlar / Dezavantajlar (Gerçekçi Mühendislik Perspektifi)
7.1 Avantajlar

Küme boyutu dengesi: sabit width’in ürettiği aşırı dengesiz yapıyı azaltmayı hedefler. 
ResearchGate
+1

Daha güçlü pruning: aşırı büyük yarıçaplı kümeler azalınca 
𝐿
𝐵
LB daha sık 
𝐷
𝑘
D
k
	​

’yi aşar.

Exact arama potansiyeli: metric + doğru bound → güvenli eleme.

Ölçeklenebilirlik: çok sorgulu sistemlerde indeks maliyeti amorti olur.

7.2 Dezavantajlar / riskler

Parametre hassasiyeti: global width + stop criteria kötü ayarlanırsa fayda düşer.

İndeks kurma maliyeti ve bellek: küme ağacı, merkez/radius saklama.

Boyut laneti tamamen çözülmez: çok yüksek boyutta bound’lar zayıflayabilir.

Non-metric benzerliklerde zor: üçgen eşitsizliği yoksa pruning garantisi kaybolur.

8) Pratik İpuçları: “Gerçekte Çalıştırırken” En Çok İşe Yaran Şeyler
8.1 Width seçimi için hızlı heuristikler

Global width başlangıcı: veriden rastgele örnek al, her noktanın en yakın komşu mesafesinin medyanını hesapla → 
𝑤
𝑔
≈
median
(
𝑁
𝑁
1
)
w
g
	​

≈median(NN1)

Local width: küme içindeki 
𝑁
𝑁
1
NN1 medyanı veya 
𝛼
α katsayılı hali:

𝑤
𝑙
𝑜
𝑐
𝑎
𝑙
=
𝛼
⋅
median
𝑥
∈
𝐶
(
𝑑
(
𝑥
,
𝑁
𝑁
1
(
𝑥
)
)
)
w
local
	​

=α⋅median
x∈C
	​

(d(x,NN1(x)))

𝛼
α tipik 1–3 arası denenir.

8.2 Pruning’i artıran mühendislik numaraları

Öncelik kuyruğu (best-first): en küçük 
𝐿
𝐵
LB önce → 
𝐷
𝑘
D
k
	​

 hızlı düşer → daha çok küme elenir.

Yapraklarda erken kesme: yaprak içi noktaları “merkeze yakınlık” sırasıyla gezmek bazen 
𝐷
𝑘
D
k
	​

’yi hızlı düşürür.

Mesafe hesaplarını önbellekleme: aynı sorguda 
𝑑
(
𝑞
,
𝜇
)
d(q,μ) tekrar edilmesin.

8.3 Mesafe metriği seçimi

Pruning’in matematiksel garantisi için metric gerekir:

Öklidyen, Manhattan, Minkowski (p≥1), cosine distance’ın bazı formları (dikkat)…
Cosine benzerliği genelde “distance = 1 - cosine_similarity” diye alınır; bu her zaman metric değildir. Exact garanti istiyorsan metric olduğundan emin ol.

8.4 Veri güncellemeleri (dinamik veri)

Sık insert/delete varsa statik indeks yeniden kurma pahalı olabilir.

Çözüm: minibatch ile yeniden inşa, veya yaprak seviyesinde tampon + periyodik yeniden dengeleme.

9) Mini Uçtan Uca Örnek: Küme Budamanın Sayısal Mantığı

Bir küme 
𝐶
C için:

𝜇
𝐶
μ
C
	​

 biliniyor

𝑅
𝐶
=
5
R
C
	​

=5

Sorgu için 
𝑑
(
𝑞
,
𝜇
𝐶
)
=
18
d(q,μ
C
	​

)=18

Alt sınır:

𝐿
𝐵
=
18
−
5
=
13
LB=18−5=13

Eğer o ana kadar bulunan en kötü (k’ıncı) komşu mesafesi 
𝐷
𝑘
=
10
D
k
	​

=10 ise:

𝐿
𝐵
=
13
>
10
⇒
k
u
¨
meyi tamamen ele
LB=13>10⇒k
u
¨
meyi tamamen ele

Bu şu demek: kümeyi açıp içindeki binlerce noktaya bakmana gerek yok. kNNVWC’nin “triangle inequality to prune unlikely clusters” yaklaşımı tam olarak bu tip elemelere dayanır. 
ResearchGate
+2
ijsdr.org
+2

10) İleri Konular: İyileştirmeler ve Varyantlar
10.1 Pivot tabanlı ek bound’lar

Birden fazla pivot 
𝑝
𝑗
p
j
	​

 seçip, her nokta/küme için 
𝑑
(
𝑝
𝑗
,
𝑥
)
d(p
j
	​

,x) gibi değerler saklanır. Sorguda:

∣
𝑑
(
𝑞
,
𝑝
𝑗
)
−
𝑑
(
𝑥
,
𝑝
𝑗
)
∣
≤
𝑑
(
𝑞
,
𝑥
)
∣d(q,p
j
	​

)−d(x,p
j
	​

)∣≤d(q,x)

ile daha sıkı alt sınırlar üretilebilir (triangle inequality’nin farklı düzenlenişi).

10.2 Approximate (yaklaşık) moda geçiş

Exact yerine gecikme kritikse:

Daha agresif pruning (güvenli olmayan)

Yapraklarda kısmi tarama

Erken durdurma

Ama bu durumda doğruluk–hız trade-off’u açıkça ölçülmeli.

10.3 Paralelleştirme

Kümeler bağımsız adaylar üretir:

Aday küme değerlendirme paralel

Yaprak tarama paralel
(Ancak best-first mantığında 
𝐷
𝑘
D
k
	​

 global paylaşıldığı için senkronizasyon tasarımı önemlidir.)

Kendini Test Et: (Zor) Teknik Sorular

Aşağıdaki sorulara net cevap verebilirsen, konuyu gerçekten “mühendis gibi” kavramışsın demektir:

Budama garantisi için hangi iki şart zorunludur? (Mesafe fonksiyonu ve bound mantığı açısından)

Bir küme için 
𝐿
𝐵
(
𝑞
,
𝐶
)
=
max
⁡
(
0
,
𝑑
(
𝑞
,
𝜇
𝐶
)
−
𝑅
𝐶
)
LB(q,C)=max(0,d(q,μ
C
	​

)−R
C
	​

) alt sınırını hangi varsayımla türetiyoruz? Türevi adım adım yaz.

Sabit width ile oluşan iki uç kötü senaryoyu (çok az/çok fazla küme) 
𝑅
𝐶
R
C
	​

, küme sayısı ve sorgu maliyeti üzerinden formülleştir.

Best-first (LB’ye göre PQ) yerine DFS/BFS gezsen 
𝐷
𝑘
D
k
	​

’nin yakınsama davranışı nasıl değişir, pruning oranını neden etkiler?

Yerel width kestirimi için “medyan NN1 mesafesi” kullanmanın outlier dayanıklılığı açısından avantajını açıklayıp, bunun hangi veri dağılımlarında yanılabileceğini söyle.

Cosine distance’ı 
1
−
cos
⁡
1−cos şeklinde kullanırsan üçgen eşitsizliği her zaman geçerli mi? Değilse, exact garantiyi nasıl korursun?

Çok yüksek boyutta uzaklıkların konsantre olması 
𝐿
𝐵
LB ve 
𝑈
𝐵
UB aralığını nasıl etkiler? Pruning oranı için beklenen sonuç nedir?

İstersen cevaplarını yaz; ben de nerelerde boşluk kaldığını tespit edip o alt konuları (metric koşulları, bound türetimi, width seçimi, yüksek boyut etkisi) daha da derinleştirerek anlatayım.

---

# . Background 15

Bu başlık belirsiz olduğu için net ve doğru bir teknik dökümantasyon üretmem mümkün değil.

“. Background 15” şu an yalnızca bir bölüm etiketi / numarası gibi görünüyor; kendi başına hangi teknik konuyu kapsadığını söylemiyor. Örneğin şu anlamlardan herhangi biri olabilir:

Bir tez / makale içindeki 15. arka plan bölümü

Daha önce konuştuğumuz bir çalışmanın 15. alt başlığı

Belirli bir alanın (ML, ağlar, güvenlik, veritabanları, sinyal işleme vb.) background açıklaması

Standart veya rapor numarası (örn. Background – Section 15)

Lütfen aşağıdakilerden en az birini netleştir:

Alan / disiplin nedir?

(Örn: Makine öğrenmesi, bilgisayar ağları, siber güvenlik, veri madenciliği, görüntü işleme, yazılım mimarisi, vb.)

“Background 15” neyin arka planı?

Bir tez, makale, proje raporu ya da ders notu mu?

Eğer varsa: başlık veya konu cümlesi

Eğer bu, önceki konuşmada geçen bir bölümse:

“kNN”, “clustering”, “anomaly detection”, “SCADA”, vb. gibi anahtar kelimeler hangileri?

İstersen şu formatta da yazabilirsin:

Background 15 = [konu adı]

Bu bilgiyi verdiğinde:

En az 6 ana başlık

Derin teknik arka plan

Matematiksel sezgi + algoritmik detay

Gerçek kullanım senaryoları

Avantaj / dezavantaj analizi

Pratik mühendislik ipuçları

Akademik/teknik dilde çok uzun ve doyurucu bir Markdown dökümantasyonu
tek seferde üreteceğim.

Netleştir, hemen başlayalım.

---

# 3. SCADA-Based Security Testbed 25

4
3. SCADA-Based Security Testbed

Kritik Altyapılar İçin Siber Güvenlik Deney Ortamlarının Teknik Arka Planı

1. Giriş ve Motivasyon
1.1 SCADA Sistemleri Nedir?

SCADA (Supervisory Control and Data Acquisition) sistemleri; enerji iletim hatları, elektrik santralleri, su ve atık su tesisleri, petrol & gaz boru hatları, üretim tesisleri gibi kritik altyapıların izlenmesi ve kontrolü için kullanılan endüstriyel kontrol sistemleridir (ICS).

Temel özellikleri:

Gerçek zamanlı izleme ve kontrol

Fiziksel süreçlerle doğrudan etkileşim

Yüksek süreklilik (availability) gereksinimi

Düşük toleranslı hata ve gecikme eşikleri

1.2 Neden “Security Testbed” Gerekli?

Gerçek SCADA ortamlarında:

Siber saldırı denemeleri yüksek risklidir

Can güvenliği ve ekonomik zarar riski vardır

Deneme–yanılma kabul edilemez

Bu nedenle SCADA-Based Security Testbed, gerçek sisteme davranışsal olarak benzeyen, ancak izole, kontrollü ve tekrarlanabilir bir deney ortamı sunar.

Sezgisel benzetme:
Bir SCADA testbed’i, gerçek bir nükleer santral yerine kullanılan uçuş simülatörü gibidir. Pilot (güvenlik araştırmacısı) en kötü senaryoları dener ama kimse ölmez, sistem çökmez.

2. SCADA-Based Security Testbed Kavramı
2.1 Tanım

SCADA-Based Security Testbed, endüstriyel kontrol sistemlerine yönelik:

Siber saldırıların

Savunma mekanizmalarının

Anomali tespit algoritmalarının

Olay müdahale stratejilerinin

gerçekçi ama güvenli biçimde test edildiği bir araştırma ve geliştirme platformudur.

2.2 Testbed’in Temel Amaçları

🔐 Güvenlik açıklarını keşfetmek

🧪 Saldırı senaryolarını simüle etmek

📊 Gerçekçi veri setleri üretmek

🤖 IDS / IPS / ML tabanlı güvenlik sistemlerini eğitmek

🛠 Savunma stratejilerini karşılaştırmak

2.3 Neden “SCADA-Based”?

Genel IT test ortamlarından farkı:

Deterministik zamanlama

Endüstriyel protokoller (Modbus, DNP3, IEC 60870-5-104)

Fiziksel süreç geri beslemesi (feedback loop)

HMI – PLC – RTU – Historian etkileşimi

3. Mimari Yapı (Architecture)
3.1 Katmanlı Mimari Yaklaşım

Tipik bir SCADA testbed’i şu katmanlardan oluşur:

3.1.1 Fiziksel Süreç Katmanı

Sanal veya fiziksel:

Tanklar

Vanalar

Motorlar

Sensörler

Matematiksel modeller (ör. diferansiyel denklemler)

3.1.2 Kontrol Katmanı

PLC (Programmable Logic Controller)

RTU (Remote Terminal Unit)

Ladder Logic / Function Block

3.1.3 Gözetim (Supervisory) Katmanı

SCADA Sunucusu

HMI (Human Machine Interface)

Alarm & event yönetimi

3.1.4 Kurumsal / IT Katmanı

Historian

Veritabanı

Analitik sistemler

Uzaktan erişim

3.2 Ağ Topolojisi

SCADA testbed’lerinde genellikle:

DMZ (Demilitarized Zone)

VLAN segmentasyonu

Firewall + IDS noktaları

Saldırgan düğüm (attacker node)

bulunur.

Analogi:
Bu yapı, kalın surlarla çevrili bir ortaçağ şehri gibidir. Dış dünya → şehir kapıları (firewall) → pazar alanı (DMZ) → saray (kontrol katmanı).

4. Saldırı Modelleri ve Tehdit Senaryoları
4.1 SCADA’ya Özgü Tehditler
4.1.1 Protokol Tabanlı Saldırılar

Modbus function code abuse

Write register / coil manipulation

Replay attacks (zaman senkronizasyonu bozulur)

4.1.2 Komut Enjeksiyonu

Setpoint manipulation

Control logic override

Unauthorized start/stop

4.1.3 Man-in-the-Middle (MITM)

Sensör verisi sahteleme

Alarm suppression

4.2 Fiziksel Etkili Siber Saldırılar

SCADA testbed’lerinin en kritik farkı:

Siber saldırının fiziksel sonucu gözlemlenebilir.

Örnek:

Tank taşması

Basınç artışı

Motor aşırı ısınması

Bu, klasik IT güvenlik laboratuvarlarında mümkün değildir.

5. Anomali Tespiti ve Güvenlik Analitiği
5.1 Veri Türleri

Testbed üzerinden toplanan veriler:

Sensör zaman serileri

PLC komut logları

Ağ trafiği (packet-level)

Alarm/event kayıtları

5.2 Anomali Türleri

Noktasal anomaliler (spike)

Davranışsal anomaliler

Zamansal tutarsızlıklar

Fizik–kontrol uyumsuzlukları

5.3 ML ve IDS Entegrasyonu

Testbed’ler özellikle:

k-NN tabanlı anomali tespiti

LSTM / GRU (zaman serisi)

Autoencoder tabanlı modeller

Signature + anomaly hibrit IDS

için etiketli veri üretme avantajı sağlar.

Analogi:
Testbed, ML modelleri için kontrollü bir spor salonu gibidir. Model “kaslarını” burada geliştirir, gerçek sisteme daha güçlü gider.

6. Kullanım Senaryoları
6.1 Akademik Araştırma

Yeni IDS algoritmaları

SCADA saldırı taksonomileri

Fizik–siber korelasyon analizi

6.2 Endüstriyel Güvenlik Testleri

Red team / blue team simülasyonları

Güvenlik ürünlerinin karşılaştırılması

Regülasyon uyum testleri

6.3 Eğitim ve Tatbikat

Operatör eğitimi

Olay müdahale (incident response)

Siber–fiziksel farkındalık

7. Avantajlar ve Dezavantajlar
7.1 Avantajlar

✅ Gerçekçi ama güvenli
✅ Tekrarlanabilir deneyler
✅ Fiziksel etkiler gözlemlenebilir
✅ Gerçek veri üretimi
✅ Çok disiplinli analiz imkânı

7.2 Dezavantajlar

❌ Kurulum karmaşıklığı
❌ Donanım maliyeti (fiziksel testbed’lerde)
❌ Modelleme hataları gerçek sistemden sapma yaratabilir
❌ Tam birebir gerçeklik asla %100 sağlanamaz

8. Pratik Mühendislik İpuçları
8.1 Gerçekçilik – Güvenlik Dengesi

Gerçek protokolleri kullan

Ama dış ağdan tam izolasyon sağla

8.2 Senaryo Otomasyonu

Saldırı senaryolarını script’leştir

Zaman damgalı replay senaryoları oluştur

8.3 Veri Etiketleme

Saldırı başlangıç/bitiş zamanlarını kesin kaydet

Fiziksel etkiyi ayrı etiketle (ör. “overflow”)

8.4 Ölçeklenebilirlik

Sanallaştırma (VM / container)

Modüler PLC ve süreç modelleri

9. Sonuç ve Büyük Resim

SCADA-Based Security Testbed’ler:

Kritik altyapı güvenliğinin olmazsa olmazı

Siber ve fiziksel dünyayı aynı deney ortamında birleştiren nadir platformlar

Anomali tespiti, saldırı simülasyonu ve savunma doğrulaması için altın standart

Özetle:

“Gerçek sisteme dokunmadan, gerçek gibi saldırmak ve savunmak istiyorsan — testbed kurmak zorundasın.”

İstersen Bir Sonraki Adımda:

Örnek bir SCADA testbed mimarisini sıfırdan tasarlayabilir

Belirli bir saldırı senaryosunu (MITM, replay, setpoint attack) adım adım analiz edebilir

Bu testbed üzerinde anomali tespit algoritması (k-NN, LSTM vb.) nasıl kurulur gösterebilirim

Hangisiyle devam edelim?

---

# Clustering 63

4
Clustering (Kümeleme) – Kapsamlı Teknik Arka Plan ve Uygulama Rehberi
1. Clustering Nedir? Temel Kavramlar ve Motivasyon
1.1 Tanım

Clustering (Kümeleme), etiketlenmemiş (unsupervised) verilerde, benzerlik ölçütlerine göre örnekleri gruplara ayırma problemidir. Amaç:

Aynı kümedeki noktaların birbirine benzer

Farklı kümelerdeki noktaların birbirinden olabildiğince farklı olmasıdır.

Matematiksel olarak:

Veri kümesi: 
𝑋
=
{
𝑥
1
,
𝑥
2
,
.
.
.
,
𝑥
𝑁
}
X={x
1
	​

,x
2
	​

,...,x
N
	​

}

Amaç: 
𝑋
X’i 
𝐾
K adet alt kümeye ayırmak

1.2 Clustering neden önemlidir?

Clustering, veri analizinin “keşif” aşamasının temelidir:

Veri yapısını anlamak

Gizli örüntüleri (latent structure) ortaya çıkarmak

Daha ileri modeller için ön işleme yapmak

Analogi:
Clustering, büyük ve karışık bir kütüphanede kitapları türlerine göre ayırmaya benzer. Etiket yoktur, ama içerik benzerliğinden doğal raflar oluşur.

2. Clustering Probleminin Matematiksel Temelleri
2.1 Benzerlik ve Mesafe Ölçütleri

Clustering tamamen mesafe tanımına bağlıdır.

Yaygın mesafeler:

Öklidyen:

𝑑
(
𝑥
,
𝑦
)
=
∑
𝑖
(
𝑥
𝑖
−
𝑦
𝑖
)
2
d(x,y)=
i
∑
	​

(x
i
	​

−y
i
	​

)
2
	​


Manhattan (L1)

Minkowski

Cosine distance

Mahalanobis (kovaryans farkındalıklı)

⚠️ Yanlış mesafe = anlamsız kümeler

2.2 Amaç Fonksiyonları

Birçok clustering algoritması bir optimizasyon problemi çözer.

Örnek (k-means):

min
⁡
∑
𝑘
=
1
𝐾
∑
𝑥
𝑖
∈
𝐶
𝑘
∣
∣
𝑥
𝑖
−
𝜇
𝑘
∣
∣
2
min
k=1
∑
K
	​

x
i
	​

∈C
k
	​

∑
	​

∣∣x
i
	​

−μ
k
	​

∣∣
2

Bu ifade:

Küme içi varyansı minimize etmeye çalışır

Küme merkezlerini “çekim noktası” gibi düşünür

2.3 NP-Zorluk ve Yaklaşımlar

Optimal clustering çoğu durumda NP-hard

Pratikte:

Heuristikler

Yaklaşık çözümler

Iteratif algoritmalar

kullanılır.

3. Clustering Algoritma Türleri (Taksonomi)
3.1 Partitioning-Based Clustering
3.1.1 k-Means

En yaygın algoritma

Küme sayısı önceden bilinir

Küresel (spherical) kümeler varsayar

Avantaj: Hızlı, basit
Dezavantaj: Outlier’lara duyarlı, K seçimi zor

3.1.2 k-Medoids (PAM)

Merkez olarak gerçek veri noktaları

Gürültüye daha dayanıklı

3.2 Hierarchical Clustering
3.2.1 Agglomerative (Bottom-Up)

Her nokta ayrı küme

Yakın kümeler birleştirilir

Sonuç: Dendrogram

Bağlama (linkage) türleri:

Single

Complete

Average

Ward

3.2.2 Divisive (Top-Down)

Tüm veri tek küme

Rekürsif bölme

Avantaj: Küme sayısı sonradan seçilebilir
Dezavantaj: Büyük veri için pahalı

3.3 Density-Based Clustering
3.3.1 DBSCAN

Yoğunluk temelli

Keyifli özellik: Gürültüyü (noise) tanır

Parametreler:

ε (epsilon): komşuluk yarıçapı

MinPts: minimum nokta sayısı

Avantaj: Keyfi şekilli kümeler
Dezavantaj: Parametre hassasiyeti

3.3.2 HDBSCAN

DBSCAN’in hiyerarşik ve daha kararlı versiyonu

3.4 Model-Based Clustering
3.4.1 Gaussian Mixture Models (GMM)

Her küme = Gaussian dağılım

EM algoritmasıyla öğrenilir

Avantaj:

Olasılıksal çıktı

Eliptik kümeler

Dezavantaj:

Lokal minimum riski

3.5 Graph & Spectral Clustering

Benzerlik grafı kurulur

Laplacian özdeğerleri kullanılır

Avantaj: Karmaşık yapı
Dezavantaj: Ölçeklenebilirlik sorunu

4. Clustering Değerlendirme Yöntemleri
4.1 İçsel (Internal) Metrikler

Silhouette Score

Davies–Bouldin

Calinski–Harabasz

4.2 Dışsal (External) Metrikler

(Etiket varsa)

Adjusted Rand Index (ARI)

Normalized Mutual Information (NMI)

4.3 Görsel Analiz

2D/3D projeksiyon (PCA, t-SNE, UMAP)

Dendrogram yorumlama

Analogi:
Küme kalitesi, bir orkestrada aynı enstrümanların gerçekten birlikte mi çaldığını dinlemek gibidir.

5. Kullanım Senaryoları
5.1 Veri Keşfi (Exploratory Data Analysis)

Müşteri segmentasyonu

Davranış profilleme

5.2 Anomali ve Outlier Tespiti

Küme dışı kalan noktalar

DBSCAN / k-NN tabanlı yaklaşımlar

5.3 Özellik Mühendisliği

Cluster ID = yeni feature

Representation learning öncesi gruplaştırma

5.4 Endüstriyel ve Siber Güvenlik

Ağ trafiği profilleme

SCADA / ICS anomali tespiti

Sistem davranış modelleri

6. Avantajlar ve Dezavantajlar
6.1 Avantajlar

✅ Etiket gerektirmez
✅ Veri yapısını ortaya çıkarır
✅ Ön işleme için güçlü
✅ Görselleştirme ve içgörü üretir

6.2 Dezavantajlar

❌ Parametre bağımlılığı
❌ Ölçeklenebilirlik sorunları
❌ Yüksek boyutta mesafe anlamsızlaşabilir
❌ “Doğru” küme tanımı sübjektiftir

7. Pratik Mühendislik İpuçları
7.1 Ön İşleme Hayati Önemdedir

Normalize / standardize et

Gürültüyü azalt

Boyut indirgeme uygula

7.2 Algoritma Seçimi İçin Rehber
Veri Yapısı	Önerilen
Küresel	k-means
Gürültülü	DBSCAN
Hiyerarşik	Agglomerative
Olasılıksal	GMM
7.3 Parametre Arama

Grid search + içsel metrikler

Elbow method (k-means)

k-distance plot (DBSCAN)

7.4 Büyük Veri için

Mini-batch k-means

Approximate nearest neighbor

Distributed clustering (Spark MLlib)

8. Clustering’in Büyük Resmi

Clustering:

Denetimsiz öğrenmenin omurgasıdır

Veri biliminde “ilk bakış”tır

Doğru kullanıldığında:

Etiket maliyetini azaltır

Sistem davranışını açıklar

Anomali ve tehditleri erken yakalar

Özetle:
Clustering, verinin “kendi kendini anlatmasına” izin vermektir.

Kendini Test Et (Zor Teknik Sorular)

k-means’in amaç fonksiyonu neden L2 normuna dayanır, L1 kullansaydık ne değişirdi?

Yüksek boyutta Öklidyen mesafenin ayırt ediciliği neden düşer?

DBSCAN’de ε yanlış seçilirse hangi iki uç senaryo oluşur?

GMM ile k-means arasındaki ilişkiyi olasılıksal olarak açıkla.

Spectral clustering neden özdeğer ayrışımı gerektirir?

Clustering sonuçlarını “yanlış ama faydalı” yapan durumlara örnek ver.

İstersen bir sonraki adımda:

Belirli bir algoritmayı (ör. DBSCAN veya GMM) matematiksel olarak derinlemesine

Gerçek bir veri seti üzerinde uçtan uca clustering süreci

Clustering + k-NN / anomaly detection entegrasyonu

confirm et, oradan devam edelim.

---

# 5. SCADA Data-Driven Anomaly Detection 87

4
5. SCADA Data-Driven Anomaly Detection

Kritik Altyapılarda Veri Tabanlı Anomali Tespiti – Kapsamlı Teknik Dökümantasyon

1. Giriş: SCADA Sistemlerinde Anomali Tespiti Neden Zor?
1.1 SCADA Ortamlarının Doğası

SCADA sistemleri klasik IT sistemlerinden temel olarak farklıdır:

Fiziksel süreçlerle kapalı çevrim (feedback loop) çalışırlar

Zaman serileri deterministik ve yüksek korelasyonludur

Hatalar yalnızca dijital değil, fiziksel sonuçlar doğurur

Bu nedenle “anormal” kavramı yalnızca istatistiksel sapma değil, fiziksel süreç ihlali anlamına gelir.

Analogi:
Bir SCADA sistemi, kalp–beyin–kas koordinasyonu olan bir insan gibidir. Nabız tek başına “normal” olabilir ama beyin sinyaliyle uyumsuzsa ciddi bir sorun vardır.

2. Data-Driven Anomaly Detection Kavramı
2.1 Tanım

Data-Driven Anomaly Detection, sistem davranışını:

Önceden yazılmış kurallara değil

Geçmiş veri üzerinden öğrenilen modellere

dayandırarak anormallik tespiti yapma yaklaşımıdır.

SCADA bağlamında bu şu anlama gelir:

“Sistemin normal çalışmayı kendisi öğrenmesi ve bu öğrenilmiş davranıştan sapmaları alarm olarak işaretlemesi”

2.2 Neden Kural Tabanlı Yöntemler Yetersiz?

Geleneksel SCADA alarmları:

Sabit eşiklere dayanır

Çok fazla false positive üretir

Yeni saldırı ve arızalara kördür

Data-driven yaklaşımlar:

Davranış temellidir

Önceden bilinmeyen saldırıları yakalayabilir

Sistem yaşlandıkça adapte olabilir

3. SCADA Verisinin Yapısı ve Zorlukları
3.1 Veri Türleri

SCADA veri kaynakları:

3.1.1 Süreç Verileri (Process Data)

Sensör ölçümleri (basınç, sıcaklık, debi)

Aktüatör durumları

Setpoint değerleri

3.1.2 Kontrol Verileri

PLC komutları

Control logic state’leri

Mode değişimleri

3.1.3 Ağ ve Sistem Verileri

Protokol mesajları (Modbus, DNP3)

Zaman damgaları

Alarm & event logları

3.2 SCADA Verisine Özgü Zorluklar
Zorluk	Açıklama
Yüksek korelasyon	Sensörler bağımsız değil
Zaman bağımlılığı	Anomali çoğu zaman sekansla ilgilidir
Dengesiz veri	Anomaliler çok nadir
Kavram kayması	Normal davranış zamanla değişir
Etiket eksikliği	“Bu saldırıdır” etiketi çoğu zaman yok

Analogi:
SCADA verisi, tek tek kelimeler değil; anlamı ancak cümle içinde ortaya çıkan bir dil gibidir.

4. Veri Tabanlı Anomali Tespit Yaklaşımları
4.1 İstatistiksel Yöntemler
4.1.1 Temel İstatistiksel Modeller

Ortalama / varyans tabanlı eşikler

Moving average, EWMA

ARIMA tabanlı tahmin hataları

Avantaj:

Basit

Yorumlanabilir

Dezavantaj:

Karmaşık saldırıları kaçırır

Çok değişkenli (multivariate) yapıya zayıf

4.2 Mesafe Tabanlı Yöntemler
4.2.1 k-Nearest Neighbour (k-NN)

Temel fikir:

Her yeni gözlemi “en yakın normal davranışlara” göre değerlendir

Uzaklık büyükse → anomali

Anomali skoru:

𝑆
𝑐
𝑜
𝑟
𝑒
(
𝑥
)
=
1
𝑘
∑
𝑖
=
1
𝑘
𝑑
(
𝑥
,
𝑁
𝑁
𝑖
(
𝑥
)
)
Score(x)=
k
1
	​

i=1
∑
k
	​

d(x,NN
i
	​

(x))

SCADA için avantajı:

Etiket gerektirmez

Davranış tabanlıdır

Dezavantajı:

Büyük veri için hesap maliyeti

Zaman bağımlılığı doğrudan modellenmez

4.3 Yoğunluk Tabanlı Yöntemler
4.3.1 DBSCAN / LOF

Normal davranış = yoğun bölgeler

Anomali = düşük yoğunluk

LOF (Local Outlier Factor):

Noktanın yerel yoğunluğunu komşularıyla kıyaslar

SCADA’da kullanım:

Çalışma modları (operating modes) doğal kümeler oluşturur

Mod dışı davranışlar yakalanabilir

4.4 Makine Öğrenmesi Tabanlı Yaklaşımlar
4.4.1 One-Class SVM

Sadece “normal” veriyi öğrenir

Sınır dışı kalanları anomali sayar

Avantaj:

Matematiksel olarak güçlü

Dezavantaj:

Parametre hassasiyeti

Ölçeklenebilirlik

4.5 Derin Öğrenme Yaklaşımları
4.5.1 Autoencoder (AE)

Girdi → sıkıştır → yeniden üret

Rekonstrüksiyon hatası anomali göstergesi

𝐸
𝑟
𝑟
𝑜
𝑟
(
𝑥
)
=
∣
∣
𝑥
−
𝑥
^
∣
∣
2
Error(x)=∣∣x−
x
^
∣∣
2
4.5.2 LSTM / GRU

Zaman bağımlılığını ö

---

# 6. A Global Anomaly Threshold to Unsupervised Detection 119

4
6. A Global Anomaly Threshold to Unsupervised Detection

Denetimsiz Anomali Tespitinde Küresel (Global) Eşikleme Yaklaşımı – Kapsamlı Teknik Dökümantasyon

1. Giriş: “Anomali Skoru Var, Peki Karar Nerede Verilecek?”
1.1 Problemin Özeti

Denetimsiz (unsupervised) anomali tespit algoritmalarının neredeyse tamamı şu çıktıyı üretir:

Bir anomali skoru
(distance, reconstruction error, likelihood, density, vb.)

Ancak sistemin gerçekten karar vermesi gereken nokta şudur:

“Bu skor ne zaman ‘anomali’ sayılacak?”

İşte bu karar mekanizmasına Anomaly Thresholding (Eşikleme) denir.

1.2 Neden “Global Threshold” Önemli?

Yerel (local) veya örneğe özgü eşikleme yerine tek bir küresel eşik (global threshold) kullanmak:

Sistem davranışını tutarlı

Alarm mekanizmasını yorumlanabilir

Endüstriyel ortamlarda sertifikalanabilir

hale getirir.

Analogi:
Bir bina yangın alarmı düşün. Her odanın kendi “yangın tanımı” olamaz. Merkezi, net ve herkesin bildiği tek bir alarm eşiği gerekir.

2. Unsupervised Anomaly Detection’da Eşikleme Sorunu
2.1 Denetimsiz Öğrenmede Etiket Yokluğu

Unsupervised sistemlerde:

“Bu noktalar anomali” diye etiketli veri yoktur

ROC, precision–recall gibi klasik eşik seçimi yöntemleri doğrudan kullanılamaz

Bu nedenle threshold seçimi:

İstatistiksel varsayımlara

Dağılım analizine

Risk toleransına

dayanır.

2.2 Anomali Skoru Türleri

Global threshold kavramı, skorun türünden bağımsızdır:

Yöntem	Skor Anlamı
k-NN	Ortalama komşu mesafesi
LOF	Yerel yoğunluk oranı
One-Class SVM	Karar fonksiyonu
Autoencoder	Rekonstrüksiyon hatası
LSTM	Tahmin hatası

Ancak skor dağılımı her yöntemde farklıdır → threshold stratejisi buna göre seçilmelidir.

3. Global Anomaly Threshold Kavramı
3.1 Tanım

Global Anomaly Threshold, tüm gözlemler için geçerli olan tek bir karar eşiğidir:

Anomaly
(
𝑥
)
=
{
1
	
if 
𝑆
(
𝑥
)
>
𝜏


0
	
otherwise
Anomaly(x)={
1
0
	​

if S(x)>τ
otherwise
	​


Burada:

𝑆
(
𝑥
)
S(x): anomali skoru

𝜏
τ: küresel eşik

3.2 Global vs Local Threshold
Özellik	Global	Local
Tutarlılık	Yüksek	Düşük
Yorumlanabilirlik	Kolay	Zor
Uygulama	Basit	Karmaşık
Adaptasyon	Zayıf	Güçlü

Sezgisel fark:
Global threshold = ülke genelinde hız limiti
Local threshold = her sokağın kendi kuralı

4. Global Threshold Belirleme Yöntemleri
4.1 İstatistiksel Dağılım Tabanlı Yöntemler
4.1.1 Ortalama – Standart Sapma (Z-Score)

Varsayım: skorlar yaklaşık normal dağılır.

𝜏
=
𝜇
+
𝑘
𝜎
τ=μ+kσ

𝑘
k: risk katsayısı (örn. 3σ)

Avantaj

Basit

Hızlı

Dezavantaj

Normal dağılım varsayımı çoğu zaman geçersiz

4.2 Percentile (Yüzdelik) Tabanlı Threshold
4.2.1 Temel Fikir

En yüksek %p’lik skorları anomali say:

𝜏
=
percentile
(
𝑆
,
100
−
𝑝
)
τ=percentile(S,100−p)

Örnek:

%99.5 percentile → en uç %0.5 anomali

Avantaj

Dağılım varsayımı yok

Endüstride yaygın

Dezavantaj

Anomali oranını önceden sabitlemiş olursun

4.3 Extreme Value Theory (EVT)
4.3.1 Teorik Temel

Aşırı uç değerler (tails), genel dağılımdan farklı davranır.

Genellikle Generalized Pareto Distribution (GPD) kullanılır

Sadece üst kuyruk modellenir

𝑃
(
𝑆
>
𝜏
)
≈
GPD
(
𝜉
,
𝛽
)
P(S>τ)≈GPD(ξ,β)

Avantaj

Teorik olarak güçlü

Nadir olaylara odaklı

Dezavantaj

Uygulaması karmaşık

Parametre kestirimi hassas

4.4 Risk-Temelli (Cost-Based) Threshold
4.4.1 Karar Teorisi Perspektifi

Amaç:

min
⁡
𝜏
  
𝐶
𝐹
𝑃
⋅
𝐹
𝑃
(
𝜏
)
+
𝐶
𝐹
𝑁
⋅
𝐹
𝑁
(
𝜏
)
τ
min
	​

C
FP
	​

⋅FP(τ)+C
FN
	​

⋅FN(τ)

Yanlış alarm maliyeti

Kaçırılan anomali maliyeti

SCADA / kritik altyapı için çok önemlidir:

False negative genelde çok daha pahalıdır

5. Global Threshold’un Sistem Davranışına Etkisi
5.1 False Positive – False Negative Dengesi

Threshold yükseldikçe:

False positive ↓

False negative ↑

Threshold düştükçe:

Alarm sayısı ↑

Operatör yorgunluğu ↑

Analogi:
Aşırı hassas duman dedektörü = herkes alarmı kapatır
Aşırı gevşek dedektör = yangın fark edilmez

5.2 Zamansal Kararlılık

Global threshold:

Zamanda tutarlı alarm üretir

Alarm yorumlamasını kolaylaştırır

Ancak:

Concept drift varsa periyodik güncelleme gerekir

6. Uçtan Uca Global Threshold Tasarım Süreci
6.1 Adım Adım Akış

Normal veri topla

Anomali skorlarını üret

Skor dağılımını analiz et

Threshold yöntemi seç

τ değerini belirle

Alarm davranışını simüle et

Gerekirse ince ayar yap

6.2 Örnek: Autoencoder + Percentile

Eğitim verisi → normal davranış

Rekonstrüksiyon hataları çıkarılır

%99 percentile = global threshold

Gerçek zamanlı sistemde tek karar kuralı

7. Kullanım Senaryoları
7.1 SCADA ve Endüstriyel Sistemler

Alarm sertifikasyonu

Operatör eğitimi

Güvenlik regülasyonları

7.2 Siber Güvenlik

IDS / NIDS skorlarının alarm kararına çevrilmesi

SOC ortamlarında sadeleştirme

7.3 IoT ve Edge Sistemler

Düşük hesaplama maliyeti

Basit karşılaştırma (score > τ)

8. Avantajlar ve Dezavantajlar
8.1 Avantajlar

✅ Basit ve hızlı
✅ Yorumlanabilir
✅ Endüstride uygulanabilir
✅ Sertifikasyon dostu

8.2 Dezavantajlar

❌ Concept drift’e duyarlı
❌ Mod değişimlerinde zorlanır
❌ Tek eşik her duruma uymayabilir

9. Pratik Mühendislik İpuçları
9.1 Threshold’u Sabit Sanma

Periyodik yeniden hesapla

Rolling window kullan

9.2 Alarm Gecikmesi Koy

Tek nokta alarm verme

Ardışık ihlal sayısı şartı ekle

9.3 Hibrit Strateji

Global threshold + local smoothing

Skor + fiziksel kısıt kontrolü

9.4 Görselleştirme

Skor zaman serisi + τ çizgisi

Operatör güveni artar

10. Büyük Resim ve Sonuç

Global Anomaly Threshold, denetimsiz anomali tespit sistemlerinde:

Model ile gerçek dünya arasındaki karar köprüsüdür

Matematiksel bir değerden çok, operasyonel bir tasarım kararıdır

Yanlış seçilirse en iyi modeli bile işe yaramaz hale getirir

Özetle:
Model anomaliyi hisseder,
threshold kararı verir.

Kendini Test Et (İleri Seviye)

Percentile tabanlı threshold hangi durumda sistematik hataya yol açar?

EVT neden sadece kuyruk bölgesine odaklanır?

Concept drift varken global threshold nasıl güncellenmelidir?

False negative maliyeti çok yüksek bir sistemde τ nasıl konumlandırılır?

Local threshold’un yakalayıp global threshold’un kaçıracağı bir senaryo tasarla.

İstersen bir sonraki adımda:

Gerçek bir skor dağılımı üzerinden threshold hesaplayabilir

SCADA verisi için EVT tabanlı threshold’u adım adım kurabilir

Global vs local threshold’u aynı veri üzerinde karşılaştırabiliriz

Nasıl devam edelim?

---

# 7. Threshold Password-Authenticated Secret Sharing Protocols

4
7. Threshold Password-Authenticated Secret Sharing Protocols (TPASS)

Dağıtık Güvenlikte Parola Tabanlı Kimlik Doğrulama ve Eşikli Giz Paylaşımının Birleşimi

1. Giriş ve Motivasyon
1.1 Problem Tanımı

Klasik parola tabanlı sistemler tek bir zayıf noktaya (single point of failure) sahiptir:

Parola çalınırsa → tüm sistem düşer

Sunucu ele geçirilirse → parola hash’leri offline saldırıya açılır

Öte yandan secret sharing (giz paylaşımı):

Güveni dağıtır

Tek bir düğümün ele geçirilmesiyle sırrın açığa çıkmasını engeller

Threshold Password-Authenticated Secret Sharing (TPASS) protokolleri bu iki dünyayı birleştirir:

Kullanıcı yalnızca parolasını bilir,
Sunucular yalnızca parolanın paylarını tutar,
Ve t eşik sayısı aşılmadan hiçbir sır açığa çıkmaz.

2. Temel Kriptografik Yapı Taşları
2.1 Parola Tabanlı Kimlik Doğrulama (PAKE Mantığı)

Parola tabanlı protokollerde amaç:

Parolayı açıkça iletmeden

Offline brute-force’a izin vermeden

Güvenli ortak sır (session key) üretmek

PAKE’nin özü:

𝐾
=
𝑓
(
password
,
randomness
)
K=f(password,randomness)

Ancak tek sunucu varsa risk büyüktür.

2.2 Threshold Secret Sharing (Eşikli Giz Paylaşımı)

En yaygın şema: Shamir Secret Sharing

Bir sır 
𝑆
S, 
𝑛
n parçaya bölünür

En az 
𝑡
t parça birleşmeden 
𝑆
S elde edilemez

Matematiksel sezgi:

𝑆
S, bir polinomun sabit terimi

Her sunucu polinomun bir noktasını tutar

𝑡
t nokta olmadan polinom çözülemez

Analogi:
Bir hazine haritası düşün. Haritanın tamamı yok; yalnızca parçaları var. En az t parça bir araya gelmeden hazine bulunamaz.

3. Threshold Password-Authenticated Secret Sharing Nedir?
3.1 Tanım

TPASS, şu üç hedefi aynı anda sağlar:

Password Authentication
Kullanıcı yalnızca parolasını bilir

Threshold Security
En az 
𝑡
t sunucu olmadan kimlik doğrulama yapılamaz

Secret Protection
Ne kullanıcı ne de tek bir sunucu sırrı tek başına öğrenemez

3.2 Temel Tehdit Modeli

TPASS şu saldırılara karşı tasarlanır:

Offline dictionary attack

Sunucu ele geçirilmesi

Insider saldırıları

Man-in-the-middle (MITM)

Varsayımlar:

En fazla 
𝑡
−
1
t−1 sunucu kötü niyetli

İletişim kanalı aktif saldırganlara açık

4. Protokol Mimarisi ve Akış
4.1 Sistem Bileşenleri

Client (C): Parolayı bilen kullanıcı

Servers (S₁…Sₙ): Parola paylarını tutan düğümler

Threshold t: Minimum katılım sayısı

4.2 Kayıt (Registration) Aşaması

Kullanıcı parola 
𝑝
𝑤
pw belirler

Parola bir sır gibi ele alınır

Secret sharing ile 
𝑛
n paya bölünür

Her sunucu bir pay alır

Önemli nokta:

Sunucular parolanın kendisini bilmez

Sadece kriptografik pay saklar

4.3 Kimlik Doğrulama (Authentication) Aşaması

---


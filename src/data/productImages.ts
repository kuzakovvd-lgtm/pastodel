import type { ImageMetadata } from "astro";

import alfredo from "../assets/products/alfredo-s-kuritsey.jpg";
import chetyreSyra from "../assets/products/chetyre-syra.jpg";
import karbonara from "../assets/products/karbonara.jpg";
import kuritsaPesto from "../assets/products/kuritsa-pesto-s-vyalenymi-tomatami.jpg";
import makEndChiz from "../assets/products/mak-end-chiz.jpg";
import paelya from "../assets/products/paelya-s-kuritsey-i-ovoshchami.jpg";
import pastaFrikadelki from "../assets/products/pasta-s-frikadelkami-i-tomatnym-sousom.jpg";
import primavera from "../assets/products/primavera.jpg";
import rizottoRiziBizi from "../assets/products/rizotto-rizi-bizi-pesto-s-zelenym-goroshkom.jpg";
import rizottoGriby from "../assets/products/rizotto-s-gribami-i-slivochnym-sousom.jpg";
import vetchinaGriby from "../assets/products/vetchina-s-gribami-v-slivochnom-souse.jpg";

const productImageMap: Record<string, ImageMetadata> = {
  "/images/products/alfredo-s-kuritsey.jpg": alfredo,
  "/images/products/chetyre-syra.jpg": chetyreSyra,
  "/images/products/karbonara.jpg": karbonara,
  "/images/products/kuritsa-pesto-s-vyalenymi-tomatami.jpg": kuritsaPesto,
  "/images/products/mak-end-chiz.jpg": makEndChiz,
  "/images/products/paelya-s-kuritsey-i-ovoshchami.jpg": paelya,
  "/images/products/pasta-s-frikadelkami-i-tomatnym-sousom.jpg": pastaFrikadelki,
  "/images/products/primavera.jpg": primavera,
  "/images/products/rizotto-rizi-bizi-pesto-s-zelenym-goroshkom.jpg": rizottoRiziBizi,
  "/images/products/rizotto-s-gribami-i-slivochnym-sousom.jpg": rizottoGriby,
  "/images/products/vetchina-s-gribami-v-slivochnom-souse.jpg": vetchinaGriby,
};

export function getProductImage(src?: string) {
  return src ? productImageMap[src] : undefined;
}

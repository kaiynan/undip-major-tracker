import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  return (
    <div className="w-full bg-[#190E08] border border-[#78350F] rounded-2xl p-4 text-amber-100 text-xs shadow-inner">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-[#24130C] border border-[#78350F] rounded-lg text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#FFFBEB] flex items-center gap-1.5">
              <span>Panduan & Batasan Platform</span>
            </h4>
            {compact && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    Tutup <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Detail <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
            UNDIP Major Matcher merupakan platform eksplorasi minat yang membantu calon mahasiswa
            mengenali program studi Universitas Diponegoro yang memiliki kesesuaian dengan preferensi
            dan ketertarikan akademik mereka.
          </p>

          {isExpanded && (
            <div className="mt-2.5 pt-2.5 border-t border-[#78350F]/70 space-y-2 text-xs text-amber-200/70 leading-relaxed">
              <p>
                <strong className="text-amber-100">Bukan Prediktor Seleksi:</strong> Hasil rekomendasi{' '}
                <strong>bukan merupakan tes psikologi profesional</strong>, tidak mengukur kecerdasan
                atau kemampuan akademik, <strong>tidak memprediksi peluang diterima di UNDIP</strong>,
                dan tidak menjamin keberhasilan akademik maupun karier.
              </p>
              <p className="flex items-center gap-1.5 text-amber-300 font-medium pt-0.5">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Gunakan hasil ini sebagai referensi awal untuk mengenal program studi dan melakukan
                eksplorasi kurikulum lebih lanjut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

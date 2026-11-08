'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ProgramScore, FacultyScore, StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { APP_NAME, EVENT_NAME } from '@/config/brand';
import {
  CardFormat,
  CardData,
  CardProgramItem,
  renderResultCard,
  getCanvasBlob,
  shareOrDownloadCard,
  downloadBlob,
} from '@/lib/canvasCardGenerator';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  MessageCircle,
  Smartphone,
  Square,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

interface ShareableResultCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  programScores: ProgramScore[];
  facultyScores?: FacultyScore[];
  programs: StudyProgram[];
  userSummary: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
  } | null;
}

export function ShareableResultCardModal({
  isOpen,
  onClose,
  programScores,
  programs,
  userSummary,
}: ShareableResultCardModalProps) {
  // Format selection: 'story' (1080x1920) or 'square' (1080x1080)
  const [format, setFormat] = useState<CardFormat>('story');

  // Optional nickname field (held strictly in component state, max 20 chars)
  const [nickname, setNickname] = useState('');

  // Active view mode in modal: 'card' (visual canvas) vs 'text' (legacy clipboard/whatsapp)
  const [mode, setMode] = useState<'card' | 'text'>('card');

  // Preview state & loading
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Hidden full-resolution drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scaled live preview canvas
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const facultyMap = React.useMemo(() => {
    const map = new Map<string, string>();
    faculties.forEach((f) => map.set(f.id, f.name));
    return map;
  }, []);

  const programMap = React.useMemo(() => {
    const map = new Map<string, StudyProgram>();
    programs.forEach((p) => map.set(p.id, p));
    return map;
  }, [programs]);

  // Prepare top 3 programs data (programScores already excludes PSDKU)
  const top3Programs = React.useMemo<CardProgramItem[]>(() => {
    return (programScores || []).slice(0, 3).map((ps, idx) => {
      const prog = programMap.get(ps.programId);
      const facName = prog ? facultyMap.get(prog.facultyId) || prog.facultyId : 'Universitas Diponegoro';
      return {
        rank: idx + 1,
        name: prog?.name || ps.programId,
        facultyName: facName,
        degreeLevel: prog?.degreeLevel || 'S1',
        score: ps.totalScore,
        tier: ps.tier,
      };
    });
  }, [programScores, programMap, facultyMap]);

  // RIASEC string
  const riasecString = React.useMemo(() => {
    if (userSummary?.topRiasec && userSummary.topRiasec.length > 0) {
      return userSummary.topRiasec.map((r) => r.code).join(' / ');
    }
    return 'R / I / A';
  }, [userSummary]);

  // Text summary for clipboard/whatsapp
  const textSummary = React.useMemo(() => {
    const list = top3Programs
      .map((p) => `${p.rank}. ${p.name} (${p.degreeLevel} ${p.facultyName}) — Tier ${p.tier} (${p.score.toFixed(1)}%)`)
      .join('\n');
    return `Hasil Eksplorasi Minat ${APP_NAME}\n${EVENT_NAME}\n${nickname ? `Pencari Minat: ${nickname}\n` : ''}\nTop 3 Rekomendasi Program Studi:\n${list}\n\nTipe Minat (RIASEC): ${riasecString}\nBidang Keilmuan: ${userSummary?.topDomain?.label || '-'}\n\nTemukan potensimu di Universitas Diponegoro bersama ${APP_NAME}!`;
  }, [top3Programs, nickname, riasecString, userSummary]);

  // Redraw canvas whenever isOpen, format, nickname, or top3Programs change
  const renderCanvas = useCallback(async () => {
    if (!isOpen) return;

    try {
      // 1. Offscreen/hidden full-size 1080px canvas
      const fullCanvas = canvasRef.current || document.createElement('canvas');
      canvasRef.current = fullCanvas;

      const cardData: CardData = {
        nickname: nickname.trim(),
        topPrograms: top3Programs,
        riasecCode: riasecString,
        topDomainLabel: userSummary?.topDomain?.label,
      };

      await renderResultCard(fullCanvas, cardData, format);

      // 2. Render downscaled live preview into previewCanvasRef
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas) {
        const previewWidth = 360;
        const previewHeight = format === 'story' ? 640 : 360;
        previewCanvas.width = previewWidth;
        previewCanvas.height = previewHeight;

        const pCtx = previewCanvas.getContext('2d');
        if (pCtx) {
          pCtx.clearRect(0, 0, previewWidth, previewHeight);
          pCtx.imageSmoothingEnabled = true;
          pCtx.drawImage(
            fullCanvas,
            0,
            0,
            fullCanvas.width,
            fullCanvas.height,
            0,
            0,
            previewWidth,
            previewHeight
          );
        }
      }
    } catch (err) {
      console.error('Failed to render result card on canvas:', err);
    }
  }, [isOpen, format, nickname, top3Programs, riasecString, userSummary]);

  useEffect(() => {
    let cancelled = false;
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        if (!cancelled) {
          setIsGenerating(true);
          renderCanvas().finally(() => {
            if (!cancelled) setIsGenerating(false);
          });
        }
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }
  }, [isOpen, format, nickname, renderCanvas]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Share flow: Web Share API -> fallback download
  const handleShare = async () => {
    if (!canvasRef.current) return;
    retroAudio.playSelect();
    try {
      const blob = await getCanvasBlob(canvasRef.current);
      const fileName = `hasil-rekomendasi-${format}-${Date.now()}.png`;
      const result = await shareOrDownloadCard(blob, fileName);
      if (result === 'shared' || result === 'downloaded') {
        showToast('Gambar tersimpan');
      }
    } catch (err) {
      console.error('Share action failed:', err);
      showToast('Gagal memproses gambar');
    }
  };

  // Direct PNG download
  const handleDownloadPng = async () => {
    if (!canvasRef.current) return;
    retroAudio.playSelect();
    try {
      const blob = await getCanvasBlob(canvasRef.current);
      const fileName = `hasil-undip-matcher-${format}.png`;
      downloadBlob(blob, fileName);
      showToast('Gambar tersimpan');
    } catch (err) {
      console.error('Download PNG failed:', err);
      showToast('Gagal mengunduh gambar');
    }
  };

  // Copy text handler
  const handleCopyText = async () => {
    retroAudio.playSelect();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textSummary);
        setCopiedText(true);
        showToast('Teks berhasil disalin!');
        setTimeout(() => setCopiedText(false), 2500);
      }
    } catch {
      showToast('Gagal menyalin teks');
    }
  };

  // WhatsApp share handler
  const handleWhatsAppShare = () => {
    retroAudio.playSelect();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textSummary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="shareable-card-modal-title"
      maxWidth="max-w-xl"
      className="p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#78350F]">
        <div className="flex items-center gap-2.5 text-[#FFFBEB] font-pixel text-xs sm:text-sm">
          <Share2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span id="shareable-card-modal-title">Bagikan Kartu Hasil Rekomendasi</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Tutup dialog"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode switcher tabs (Visual Card vs Text Summary) */}
      <div className="grid grid-cols-2 gap-2 mt-4 bg-[#140B07] p-1 rounded-xl border border-[#78350F]/70">
        <button
          onClick={() => {
            retroAudio.playSelect();
            setMode('card');
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
            mode === 'card'
              ? 'bg-[#F59E0B] text-stone-950 font-pixel shadow-xs'
              : 'text-amber-200/80 hover:text-white'
          }`}
          aria-label="Mode Kartu Gambar Visual"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Kartu Gambar</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setMode('text');
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
            mode === 'text'
              ? 'bg-[#F59E0B] text-stone-950 font-pixel shadow-xs'
              : 'text-amber-200/80 hover:text-white'
          }`}
          aria-label="Mode Salin Teks / WhatsApp"
        >
          <FileText className="w-4 h-4" />
          <span>Salin Teks / WA</span>
        </button>
      </div>

      {mode === 'card' ? (
        <div className="space-y-4 mt-4">
          {/* Controls: Format Picker & Nickname Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#190E08] p-3 rounded-xl border border-[#78350F]/70">
            {/* Format Picker */}
            <div>
              <label className="font-pixel text-[10px] text-[#FDE68A] uppercase block mb-1.5">
                Format Ukuran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playSelect();
                    setFormat('story');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                    format === 'story'
                      ? 'bg-[#78350F] text-[#FDE68A] border-[#F59E0B]'
                      : 'bg-[#140B07] text-amber-200/70 border-[#78350F]/60 hover:text-white'
                  }`}
                  aria-label="Format Story 1080x1920 (9:16)"
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[11px]">Story (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playSelect();
                    setFormat('square');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                    format === 'square'
                      ? 'bg-[#78350F] text-[#FDE68A] border-[#F59E0B]'
                      : 'bg-[#140B07] text-amber-200/70 border-[#78350F]/60 hover:text-white'
                  }`}
                  aria-label="Format Square 1080x1080 (1:1)"
                >
                  <Square className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[11px]">Square (1:1)</span>
                </button>
              </div>
            </div>

            {/* Optional Nickname input */}
            <div>
              <label
                htmlFor="nickname-input"
                className="font-pixel text-[10px] text-[#FDE68A] uppercase flex items-center justify-between mb-1.5"
              >
                <span>Nama di Kartu:</span>
                <span className="font-mono text-[9px] text-amber-300/60 lowercase">opsional</span>
              </label>
              <div className="relative">
                <input
                  id="nickname-input"
                  type="text"
                  maxLength={20}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Misal: Andi / Rina"
                  className="w-full bg-[#140B07] border border-[#78350F] rounded-lg px-3 py-2 text-xs text-white placeholder-amber-200/40 focus:outline-hidden focus:border-[#F59E0B] min-h-[44px]"
                  aria-label="Nama panggilan di kartu (maksimal 20 karakter)"
                />
                <span className="absolute right-2.5 top-3 text-[10px] font-mono text-amber-200/50">
                  {nickname.length}/20
                </span>
              </div>
            </div>
          </div>

          {/* Card Preview Container */}
          <div className="relative bg-[#0F0804] border-2 border-[#78350F] rounded-2xl p-3 flex flex-col items-center justify-center min-h-[280px] max-h-[360px] overflow-hidden shadow-inner">
            {isGenerating && (
              <div className="absolute inset-0 bg-[#0F0804]/80 flex flex-col items-center justify-center z-10 gap-2">
                <Sparkles className="w-6 h-6 text-[#F59E0B] animate-spin" />
                <span className="font-pixel text-[10px] text-amber-200">Menyusun Pixel Art Kartu...</span>
              </div>
            )}

            <div
              className={`transition-all duration-300 flex items-center justify-center ${
                format === 'story' ? 'aspect-[9/16] h-[320px]' : 'aspect-square h-[280px]'
              }`}
            >
              <canvas
                ref={previewCanvasRef}
                className="max-h-full max-w-full rounded-lg shadow-lg border border-[#F59E0B]/40 object-contain"
                aria-label="Pratinjau kartu hasil rekomendasi"
              />
            </div>

            {/* Hidden full-res rendering canvas */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-stone-950 bg-[#F59E0B] hover:bg-[#FBBF24] border-2 border-[#FDE68A] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer min-h-[44px] active:scale-98 font-pixel"
              aria-label="Bagikan Gambar ke Media Sosial atau Simpan"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Gambar</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-amber-200 hover:text-white bg-[#190E08] hover:bg-[#2A160E] border-2 border-[#78350F] transition-colors cursor-pointer min-h-[44px]"
              aria-label="Unduh gambar PNG kartu hasil"
            >
              <Download className="w-4 h-4 text-[#F59E0B]" />
              <span>Unduh PNG</span>
            </button>
          </div>
        </div>
      ) : (
        /* Mode: Text summary / WhatsApp share */
        <div className="space-y-3 mt-4">
          <p className="text-xs text-amber-100/90 leading-relaxed">
            Salin ringkasan teks hasil eksplorasi minat untuk dikirim via chat ke orang tua, guru BK, atau teman:
          </p>

          <textarea
            readOnly
            value={textSummary}
            aria-label="Ringkasan teks hasil rekomendasi"
            className="w-full bg-[#190E08] p-3 rounded-xl border-2 border-[#78350F] font-mono text-[11px] sm:text-xs text-amber-100/90 leading-relaxed resize-none h-44 focus:outline-hidden focus:border-amber-400 select-all"
          />

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyText}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer min-h-[44px] ${
                copiedText
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-[#190E08] hover:bg-[#341A10] border-[#78350F] text-amber-200 hover:text-white'
              }`}
              aria-label="Salin teks ke papan klip"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 border-2 border-emerald-400 shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer min-h-[44px]"
              aria-label="Kirim teks ringkasan via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A0E08] border-2 border-[#F59E0B] text-[#FDE68A] font-pixel text-xs px-4 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </Modal>
  );
}

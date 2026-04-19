import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { API_BASE } from "../config/api.js";

function StarsInput({ value, onChange }) {
  const v = value || 0;
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
        >
          <FaStar
            className={`h-8 w-8 ${
              n <= v ? "text-amber-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {v ? `${v} / 5` : "Tap to rate"}
      </span>
    </div>
  );
}

function StarsReadOnly({ rating }) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0));
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          className={`h-4 w-4 ${n <= Math.round(r) ? "" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function ProductEngagement({
  listingId,
  activeTab,
  onReviewStatsChange,
}) {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [questions, setQuestions] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ kind: "", text: "" });

  const [qText, setQText] = useState("");
  const [qName, setQName] = useState("");
  const [qBusy, setQBusy] = useState(false);
  const [qMsg, setQMsg] = useState({ kind: "", text: "" });

  const loadReviews = useCallback(async () => {
    if (!listingId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/engagement/listings/${listingId}/reviews`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setReviewCount(Number(data.count) || 0);
      onReviewStatsChange?.({
        average: data.averageRating ?? null,
        count: Number(data.count) || 0,
      });
    } catch {
      /* ignore */
    }
  }, [listingId, onReviewStatsChange]);

  const loadQuestions = useCallback(async () => {
    if (!listingId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/engagement/listings/${listingId}/questions`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch {
      /* ignore */
    }
  }, [listingId]);

  useEffect(() => {
    loadReviews();
    loadQuestions();
  }, [loadReviews, loadQuestions]);

  async function submitReview(e) {
    e.preventDefault();
    setReviewMsg({ kind: "", text: "" });
    if (!rating || rating < 1 || rating > 5) {
      setReviewMsg({ kind: "err", text: "Please select a star rating." });
      return;
    }
    if (comment.trim().length < 3) {
      setReviewMsg({
        kind: "err",
        text: "Please write a short comment (at least 3 characters).",
      });
      return;
    }
    setReviewBusy(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/engagement/listings/${listingId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
            authorName: reviewName.trim(),
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setReviewMsg({
          kind: "err",
          text: data.message || "Could not submit review.",
        });
        return;
      }
      setReviewMsg({ kind: "ok", text: "Thanks — your review was posted." });
      setComment("");
      setRating(0);
      setReviewName("");
      await loadReviews();
    } catch (err) {
      setReviewMsg({
        kind: "err",
        text: err?.message || "Network error.",
      });
    } finally {
      setReviewBusy(false);
    }
  }

  async function submitQuestion(e) {
    e.preventDefault();
    setQMsg({ kind: "", text: "" });
    if (qText.trim().length < 3) {
      setQMsg({
        kind: "err",
        text: "Please enter your question (at least 3 characters).",
      });
      return;
    }
    setQBusy(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/engagement/listings/${listingId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: qText.trim(),
            authorName: qName.trim(),
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setQMsg({
          kind: "err",
          text: data.message || "Could not submit question.",
        });
        return;
      }
      setQMsg({
        kind: "ok",
        text: "Your question was sent. We will reply here when possible.",
      });
      setQText("");
      setQName("");
      await loadQuestions();
    } catch (err) {
      setQMsg({
        kind: "err",
        text: err?.message || "Network error.",
      });
    } finally {
      setQBusy(false);
    }
  }

  if (activeTab === "reviews") {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Rate this product
          </p>
          <form onSubmit={submitReview} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <StarsInput value={rating} onChange={setRating} />
            <div>
              <label className="text-xs text-gray-600">Your name (optional)</label>
              <input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Anonymous"
                maxLength={80}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Your review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Share your experience with this laptop…"
                maxLength={2000}
                required
              />
            </div>
            {reviewMsg.text ? (
              <p
                className={`text-sm ${
                  reviewMsg.kind === "ok" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {reviewMsg.text}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={reviewBusy}
              className="rounded-lg bg-[#112B54] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {reviewBusy ? "Submitting…" : "Submit review"}
            </button>
          </form>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
            All reviews ({reviewCount})
          </p>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to rate this product.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((rev) => (
                <li
                  key={rev._id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StarsReadOnly rating={rev.rating} />
                    <span className="text-sm font-medium text-gray-900">
                      {rev.authorName || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {rev.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "qa") {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Ask a question
          </p>
          <form
            onSubmit={submitQuestion}
            className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3"
          >
            <div>
              <label className="text-xs text-gray-600">Your name (optional)</label>
              <input
                value={qName}
                onChange={(e) => setQName(e.target.value)}
                className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Anonymous"
                maxLength={80}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Question</label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Does this include the original charger?"
                maxLength={2000}
                required
              />
            </div>
            {qMsg.text ? (
              <p
                className={`text-sm ${
                  qMsg.kind === "ok" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {qMsg.text}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={qBusy}
              className="rounded-lg bg-[#112B54] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {qBusy ? "Sending…" : "Post question"}
            </button>
          </form>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
            Questions &amp; answers
          </p>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions yet.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((q) => (
                <li
                  key={q._id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-blue-600">Q:</span> {q.question}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {q.authorName || "Anonymous"}
                    {q.createdAt
                      ? ` · ${new Date(q.createdAt).toLocaleDateString()}`
                      : ""}
                  </p>
                  {q.answer && String(q.answer).trim() ? (
                    <p className="mt-3 text-sm text-gray-700 border-t border-gray-100 pt-3">
                      <span className="font-medium text-emerald-800">Store reply:</span>{" "}
                      {q.answer}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-amber-700">
                      Awaiting reply from the store.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return null;
}

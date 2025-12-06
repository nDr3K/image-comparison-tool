import {useState, useEffect} from 'react';
import {Image as ImageIcon, Link as LinkIcon} from 'lucide-react';
import ImageComparison from './components/ImageComparison';
import Toast from './components/Toast';

function App() {
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [inputBefore, setInputBefore] = useState('');
  const [inputAfter, setInputAfter] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const before = params.get('before');
    const after = params.get('after');

    if (before) {
      setBeforeImage(before);
      setInputBefore(before);
    }
    if (after) {
      setAfterImage(after);
      setInputAfter(after);
    }
  }, []);

  const handleCompare = () => {
    if (!inputBefore || !inputAfter) return;

    const params = new URLSearchParams();
    params.set('before', inputBefore);
    params.set('after', inputAfter);
    window.history.pushState({}, '', `?${params.toString()}`);

    setBeforeImage(inputBefore);
    setAfterImage(inputAfter);
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowToast(true);
  };

  const hasImages = beforeImage && afterImage;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {!hasImages ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Image Comparison Tool
              </h1>
              <p className="text-slate-400 text-lg">
                Compare before and after images with a vertical slider
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-semibold text-white">Get Started</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Before Image URL
                    </label>
                    <input
                      type="text"
                      value={inputBefore}
                      onChange={(e) => setInputBefore(e.target.value)}
                      placeholder="https://example.com/before.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      After Image URL
                    </label>
                    <input
                      type="text"
                      value={inputAfter}
                      onChange={(e) => setInputAfter(e.target.value)}
                      placeholder="https://example.com/after.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCompare}
                    disabled={!inputBefore || !inputAfter}
                    className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30"
                  >
                    Compare Images
                  </button>
                </div>

                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400">
                    <span className="font-medium text-slate-300">Tip:</span> You can also share a
                    direct link with image URLs like:
                  </p>
                  <code className="block mt-2 text-xs text-emerald-400 break-all">
                    ?before=IMAGE_URL&after=IMAGE_URL
                  </code>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  setBeforeImage('');
                  setAfterImage('');
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all backdrop-blur-sm border border-white/20"
              >
                New Comparison
              </button>
              <button
                onClick={handleShareLink}
                className="px-6 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg transition-all backdrop-blur-sm border border-emerald-500/30 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Share Link
              </button>
            </div>

            <div className="max-w-6xl mx-auto" style={{height: 'calc(100vh - 160px)'}}>
              <ImageComparison beforeImage={beforeImage} afterImage={afterImage} />
            </div>

          </div>
        )}
      </div>

      <Toast
        message="Link copied to clipboard!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default App;

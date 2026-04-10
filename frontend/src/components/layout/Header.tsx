import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            JobFlow
          </span>
        </div>

        {/* User section */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-400">{user.name}</span>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

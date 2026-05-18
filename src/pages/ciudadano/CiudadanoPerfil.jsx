import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import apiClient from '../../config/api';
import CiudadanoFooter from '../../components/CiudadanoFooter';

export default function CiudadanoPerfil() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // TODO: reemplazar con llamada a gestión-de-usuarios cuando esté disponible
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [form, setForm] = useState({
    phone: user?.phone || '',
    notificationprefs: user?.notificationprefs || 'push',
  });

  const [passwordForm, setPasswordForm] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch full user profile from gestion-de-usuarios
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.userId) return;
        const data = await apiClient.get(`/api/users/${user.userId}`);
        setProfileData(data);
        setForm({
          phone: data.phone || '',
          notificationprefs: data.notificationPrefs || 'push',
        });
      } catch {
        // Fallback to stored user data
        setProfileData(null);
      }
    };
    fetchProfile();
  }, [user?.userId]);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await apiClient.put(`/api/users/${user.userId}`, {
        phone: form.phone,
      });
      setEditando(false);
    } catch {
      // silently fail for now
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarPassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordForm.nueva !== passwordForm.confirmar) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    if (passwordForm.nueva.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setGuardando(true);
    try {
      await apiClient.put('/api/auth/change-password', {
        currentPassword: passwordForm.actual,
        newPassword: passwordForm.nueva,
      });
      setPasswordSuccess('Contraseña actualizada correctamente.');
      setCambiandoPassword(false);
      setPasswordForm({ actual: '', nueva: '', confirmar: '' });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error al cambiar la contraseña. Verifica tu contraseña actual.';
      setPasswordError(msg);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-md p-1">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/reportes" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Mis Reportes</Link>
            <Link to="/ayuda" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Ayuda</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-white/30 transition-all"
              >
                {initials}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#e4e2e2] w-48 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#f5f3f3]">
                    <p className="text-sm font-bold font-headline text-[#1b1c1c]">{user?.fullName}</p>
                    <p className="text-[10px] text-[#424752] capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
                  </div>
                  <Link
                    to="/ciudadano/perfil"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1b1c1c] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#ba1a1a] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>Cerrar sesión
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white font-headline font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-xs capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <Link to="/ciudadano/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10">
              <span className="material-symbols-outlined">person</span>Mi Perfil
            </Link>
            <Link to="/ayuda" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>Ayuda
            </Link>
            <div className="border-t border-white/10 my-4"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-1">Mi Perfil</h1>
          <p className="text-[#424752] text-sm">Revisa y actualiza tu información personal.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Avatar y datos fijos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3] flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-2xl font-bold font-headline">
              {initials}
            </div>
            <div>
              <p className="font-headline font-extrabold text-[#1b1c1c] text-lg">{user?.fullName}</p>
              <span className="inline-block mt-1 bg-[#c5dcfd] text-[#003a7a] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                {user?.roleName?.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            <div className="w-full border-t border-[#f5f3f3] pt-4 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-[#424752]">
                <span className="material-symbols-outlined text-base text-[#003a7a]">email</span>
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#424752]">
                <span className="material-symbols-outlined text-base text-[#003a7a]">badge</span>
                <span>{profileData?.rut || user?.rut || 'No disponible'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#424752]">
                <span className="material-symbols-outlined text-base text-[#003a7a]">phone</span>
                <span>{profileData?.phone || user?.phone || form.phone || 'No registrado'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 border border-[#ba1a1a] text-[#ba1a1a] font-headline font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-red-50 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-sm">logout</span>Cerrar sesión
            </button>
          </div>

          {/* Datos editables */}
          <div className="md:col-span-2 space-y-6">

            {/* Información de contacto */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-extrabold text-[#003a7a]">Información de Contacto</h2>
                {!editando ? (
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-1 text-[#003a7a] font-bold text-sm hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>Editar
                  </button>
                ) : (
                  <button
                    onClick={() => setEditando(false)}
                    className="flex items-center gap-1 text-[#737783] font-bold text-sm hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>Cancelar
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Nombre — solo lectura */}
                <div>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">Nombre completo</label>
                  <p className="text-sm text-[#1b1c1c] bg-[#f5f3f3] rounded-lg px-4 py-3">{user?.fullName}</p>
                </div>

                {/* Email — solo lectura */}
                <div>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">Correo electrónico</label>
                  <p className="text-sm text-[#1b1c1c] bg-[#f5f3f3] rounded-lg px-4 py-3">{user?.email}</p>
                </div>

                {/* Teléfono — editable */}
                <div>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">Teléfono</label>
                  {editando ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full text-sm text-[#1b1c1c] border border-[#c2c6d4] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003a7a] transition-colors"
                    />
                  ) : (
                    <p className="text-sm text-[#1b1c1c] bg-[#f5f3f3] rounded-lg px-4 py-3">
                      {form.phone || 'No registrado'}
                    </p>
                  )}
                </div>

                {/* Notificaciones — editable */}
                <div>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">Preferencia de notificaciones</label>
                  {editando ? (
                    <select
                      value={form.notificationprefs}
                      onChange={(e) => setForm({ ...form, notificationprefs: e.target.value })}
                      className="w-full text-sm text-[#1b1c1c] border border-[#c2c6d4] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003a7a] transition-colors"
                    >
                      <option value="push">Push</option>
                      <option value="email">Email</option>
                      <option value="both">Ambas</option>
                      <option value="none">Ninguna</option>
                    </select>
                  ) : (
                    <p className="text-sm text-[#1b1c1c] bg-[#f5f3f3] rounded-lg px-4 py-3 capitalize">
                      {form.notificationprefs}
                    </p>
                  )}
                </div>

                {editando && (
                  <button
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="w-full bg-[#0050A5] text-white font-headline font-bold py-3 rounded-full hover:bg-[#003A7A] transition-colors shadow-md disabled:opacity-60"
                  >
                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                )}
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-extrabold text-[#003a7a]">Seguridad</h2>
                {!cambiandoPassword ? (
                  <button
                    onClick={() => setCambiandoPassword(true)}
                    className="flex items-center gap-1 text-[#003a7a] font-bold text-sm hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">lock</span>Cambiar contraseña
                  </button>
                ) : (
                  <button
                    onClick={() => { setCambiandoPassword(false); setPasswordError(''); }}
                    className="flex items-center gap-1 text-[#737783] font-bold text-sm hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>Cancelar
                  </button>
                )}
              </div>

              {!cambiandoPassword ? (
                <div>
                  <p className="text-sm text-[#424752]">Tu contraseña fue actualizada por última vez recientemente.</p>
                  {passwordSuccess && (
                    <p className="text-xs text-green-600 font-medium mt-2">{passwordSuccess}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {['actual', 'nueva', 'confirmar'].map((campo) => (
                    <div key={campo}>
                      <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">
                        {campo === 'actual' ? 'Contraseña actual' : campo === 'nueva' ? 'Nueva contraseña' : 'Confirmar contraseña'}
                      </label>
                      <input
                        type="password"
                        value={passwordForm[campo]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [campo]: e.target.value })}
                        className="w-full text-sm border border-[#c2c6d4] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003a7a] transition-colors"
                      />
                    </div>
                  ))}
                  {passwordError && (
                    <p className="text-xs text-[#ba1a1a] font-medium">{passwordError}</p>
                  )}
                  <button
                    onClick={handleCambiarPassword}
                    disabled={guardando}
                    className="w-full bg-[#0050A5] text-white font-headline font-bold py-3 rounded-full hover:bg-[#003A7A] transition-colors shadow-md disabled:opacity-60"
                  >
                    {guardando ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <CiudadanoFooter />
    </div>
  );
}
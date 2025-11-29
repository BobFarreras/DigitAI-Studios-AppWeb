import { getAdminUsersList } from '@/app/actions/get-users';
import { getTranslations } from 'next-intl/server';

export default async function AdminUsersPage() {
  const users = await getAdminUsersList();
  const t = await getTranslations('AdminDashboard');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Usuaris Registrats</h1>
          <p className="text-gray-500">Gestió de leads i clients ({users.length})</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
          Exportar CSV
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Data Registre</th>
              <th className="px-6 py-3">Usuari / Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3 text-right">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500">
                  {/* SOLUCIÓN: Verificamos si existe created_at */}
                  {user.created_at ? (
                    <>
                      {new Date(user.created_at).toLocaleDateString('ca-ES', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                      <div className="text-xs text-gray-400">
                        {new Date(user.created_at).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {user.full_name || 'Sense nom'}
                  </div>
                  <div className="text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'client' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role ? user.role.toUpperCase() : 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Contactar
                  </a>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Encara no hi ha usuaris registrats.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
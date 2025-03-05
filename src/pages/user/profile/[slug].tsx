import Button from '@/components/atoms/Button';
import PageTitle from '@/components/atoms/PageTitle';
import { getProfileByUsername } from '@/service/api/profiles';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type ProfileProps = {
  slug: string;
};

export default function Profile({ slug }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string>('https://avatar.iran.liara.run/public');

  useEffect(() => {
    setLoading(true);
    getProfileByUsername(slug)
      .then((profileData) => {
        setProfile(profileData);

        if (profileData?.keycloakId) {
          const minioImageUrl = `http://localhost:9000/images/${profileData.keycloakId}.jpg`;
          fetch(minioImageUrl, { method: "HEAD" })
            .then((response) => {
              if (response.ok) {
                setProfileImage(minioImageUrl);
              }
            })
            .catch(() => {
              setProfileImage(`https://avatar.iran.liara.run/username?username=${profileData.username}`);
            });
        }
      })
      .catch((error) => {
        console.error('Erro ao obter perfil:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 font-bold text-xl">Perfil não encontrado.</p>
      </div>
    );
  }

  const router = useRouter();

  return (
    <div>
      <PageTitle>Perfil do usuário - {profile.firstName}</PageTitle>
      <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-500 text-white px-6 py-4">
          <p className="text-sm">Informações do usuário cadastradas no sistema GYMA</p>
        </div>
        <div className='flex gap-7 p-6'>
          <div className="flex justify-center py-4">
            <img
              src={profileImage}
              alt="Imagem de perfil"
              className="rounded-full h-56 w-56 object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="px-6 pt-5 space-y-2">
            <div>
              <p className="text-gray-600 font-medium">Nome de usuário:</p>
              <p className="text-red-700 text-lg font-semibold">{profile.username}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Nome:</p>
              <p className="text-red-700 text-lg font-semibold">{profile.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Sobrenome:</p>
              <p className="text-red-700 text-lg font-semibold">{profile.lastName}</p>
            </div>
            <div className='pb-4'>
              <p className="text-gray-600 font-medium">Email:</p>
              <p className="text-red-700 text-lg font-semibold">{profile.email}</p>
            </div>
          </div>
        </div>
        <div className='p-6'>
          <Button onClick={() => router.back()}>Voltar a página anterior</Button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  return {
    props: {
      slug,
    },
  };
};
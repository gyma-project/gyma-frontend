// pages/[slug].tsx

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

  useEffect(() => {
    setLoading(true);
    getProfileByUsername(slug)
      .then((profileData) => {
        setProfile(profileData);
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

  const router = useRouter()

  return (
    <div>
      <PageTitle>Perfil do usuário {profile.firstName}</PageTitle>
      <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-500 text-white px-6 py-4">
          <p className="text-sm">Informações do usuário cadastradas no sistema GYMA</p>
        </div>
        <div className="px-6 py-8 space-y-4">
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
          <div className='pb-16'>
            <p className="text-gray-600 font-medium">Email:</p>
            <p className="text-red-700 text-lg font-semibold">{profile.email}</p>
          </div>
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
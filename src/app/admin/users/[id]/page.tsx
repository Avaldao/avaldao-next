import Page from "@/components/layout/page";
import UsersService from "@/services/users-service";

interface UersDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: UersDetailsPageProps) {
  const { id } = await params;

  const user = await new UsersService().getUser(id);

  return (
    <Page>
      <div className="text-slate-700">
        <pre>
          {JSON.stringify(user, null, 3)}
        </pre>
      </div>
    </Page>
  )
}
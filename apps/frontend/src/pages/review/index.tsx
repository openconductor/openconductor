import { MessageType } from '@openconductor/db/types';
import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import MessageTable from '~/pages/review/messageTable';

const Review: NextPage = () => {
  return (
    <AppLayout>
      <MessageTable type={MessageType.REVIEW} />
    </AppLayout>
  );
};

export default Review;

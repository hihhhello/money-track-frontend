type EditTransactionPageProps = {
  params: {
    transactionId: number;
  };
};

const EditTransactionPage = ({ params }: EditTransactionPageProps) => {
  return (
    <div>
      <h1>{params.transactionId}</h1>
    </div>
  );
};

export default EditTransactionPage;

import { api } from '@/shared/api/api';
import { CategoriesPageContent } from './_ui/CategoriesPageContent';

const CategoriesPage = async () => {
  const categories = await api.categories.getAll();

  return <CategoriesPageContent categories={categories} />;
};

export default CategoriesPage;

import { createClient } from "@/lib/supabase/client";
import { CategoryFormData } from "@/types";

const supabase = createClient();

export const categoryService = {
  // Create a new category
  async createCategory(data: CategoryFormData) {
    try {
      const { data: category, error } = await supabase
        .from("categories")
        .insert([
          {
            name: data.name,
            description: data.description,
            slug: data.name.toLowerCase().replace(/\s+/g, "-"),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Get all categories
  async getCategories(searchQuery?: string) {
    try {
      let query = supabase.from("categories").select("*, events(count)");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data: categories, error } = await query;

      if (error) throw error;
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get a single category by ID
  async getCategoryById(categoryId: string) {
    try {
      const { data: category, error } = await supabase
        .from("categories")
        .select("*, events(*)")
        .eq("id", categoryId)
        .single();

      if (error) throw error;
      return category;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Update a category
  async updateCategory(categoryId: string, data: Partial<CategoryFormData>) {
    try {
      const { data: category, error } = await supabase
        .from("categories")
        .update({
          name: data.name,
          description: data.description,
          slug: data.name?.toLowerCase().replace(/\s+/g, "-"),
        })
        .eq("id", categoryId)
        .select()
        .single();

      if (error) throw error;
      return category;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete a category
  async deleteCategory(categoryId: string) {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // Get category analytics
  async getCategoryAnalytics(categoryId: string) {
    try {
      const { data, error } = await supabase.rpc("get_category_analytics", {
        category_id: categoryId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching category analytics:", error);
      throw error;
    }
  },
};

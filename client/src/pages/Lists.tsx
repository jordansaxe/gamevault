import { ListCard } from "@/components/ListCard";
import { Button } from "@/components/ui/button";
import { Plus, ListPlus } from "lucide-react";

const customLists: any[] = [];

export default function Lists() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-semibold" data-testid="text-lists-title">
              Lists
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and organize custom game collections
            </p>
          </div>
        </div>
        <Button onClick={() => console.log('Create custom list')} data-testid="button-create-list">
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </div>

      {customLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-lists">
          <ListPlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Lists Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Create custom lists to organize your games by genre, mood, or any category you like
          </p>
          <Button onClick={() => console.log('Create custom list')} data-testid="button-create-first-list">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customLists.map((list) => (
            <ListCard key={list.id} {...list} />
          ))}
        </div>
      )}
    </div>
  );
}

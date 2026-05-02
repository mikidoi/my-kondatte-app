import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSignalR } from "../../hooks/useSignalR";
import useBreakpoint from "../../hooks/useBreakpoint";
import RecipeForm, { RecipeFormHandle } from "../../components/RecipeForm";
import { recipeApi } from "../../api/recipe-api";
import DesktopLayout from "../../components/layout/desktop/DesktopLayout";
import TabletLayout from "../../components/layout/TabletLayout";
import MobileLayout from "../../components/layout/MobileLayout";
import SearchBar from "../../components/SearchBar";
import ViewToggle from "../../components/buttons/ViewToggle";
import IcoChevL from "../../components/icons/IcoChevL";
import IcoChevR from "../../components/icons/IcoChevR";
import IcoPlus from "../../components/icons/IcoPlus";
import RecipeGridCard from "./components/RecipeGridCard";
import RecipeListRow from "./components/RecipeListRow";
import "./RecipeListPage.css";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  imagePath?: string;
}

type ViewMode = "grid" | "list";
type SortBy = "Recent" | "Rating" | "Quickest";

const SORT_OPTIONS: SortBy[] = ["Recent", "Rating", "Quickest"];

export const RecipeListPage: React.FC = () => {
  const bp = useBreakpoint();
  console.log("Current breakpoint:", bp);
  const formRef = useRef<RecipeFormHandle>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("Recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/recipe")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setRecipes)
      .catch((e: Error) => {
        console.error(e);
        setError(e.message);
      });
  }, []);

  useSignalR("/hubs/recipe", [
    {
      name: "RecipeCreated",
      handler: (recipe: unknown) =>
        setRecipes((prev) => [...prev, recipe as Recipe]),
    },
    {
      name: "RecipeDeleted",
      handler: (id: unknown) =>
        setRecipes((prev) => prev.filter((r) => r.id !== (id as number))),
    },
  ]);

  const uploadRecipe = (newRecipe: {
    name: string;
    ingredients: string;
    instructions: string;
    image: File | null;
  }) => {
    const formData = new FormData();
    formData.append("name", newRecipe.name);
    formData.append("ingredients", newRecipe.ingredients);
    formData.append("instructions", newRecipe.instructions);
    if (newRecipe.image) formData.append("file", newRecipe.image);
    recipeApi.getRecipes(formData).catch((e: Error) => setError(e.message));
  };

  const deleteRecipe = async (id: number) => {
    await fetch(`/api/recipe/${id}`, { method: "DELETE" });
  };

  const toggleLike = (id: number) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    let list = [...recipes];
    if (search)
      list = list.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    if (sortBy === "Rating")
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Quickest") list = list.sort((a, b) => a.id - b.id);
    return list;
  }, [recipes, search, sortBy]);

  const shared = {
    filtered,
    search,
    setSearch,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    likedIds,
    toggleLike,
    deleteRecipe,
    onNewRecipe: () => formRef.current?.open(),
  };

  if (error) {
    return (
      <div
        className="kondate-list"
        style={{ padding: 40, color: "red", fontSize: 14 }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div className="kondate-list">
      <RecipeForm ref={formRef} onSubmit={uploadRecipe} />
      {bp === "mobile" && (
        <MobileLayout
          {...shared}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />
      )}
      {bp === "tablet" && (
        <TabletLayout
          {...shared}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />
      )}
      {bp === "desktop" && (
        <DesktopLayout recipeCount={recipes.length}>
          <div
            style={{
              flex: 1,
              display: "flex",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Sidebar */}
            <aside
              style={{
                width: sidebarOpen ? 240 : 0,
                flexShrink: 0,
                background: "var(--white)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                overflowY: sidebarOpen ? "auto" : "hidden",
                overflowX: "hidden",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
                padding: sidebarOpen ? "24px 0" : "0",
                position: "relative",
              }}
            >
              <div
                style={{
                  opacity: sidebarOpen ? 1 : 0,
                  transition: "opacity 0.15s",
                  width: 240,
                  flexShrink: 0,
                }}
              >
                <div style={{ padding: "0 20px 20px" }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-soft)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 10,
                    }}
                  >
                    Sort by
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: 10,
                          background:
                            sortBy === s ? "var(--olive-pale)" : "transparent",
                          color:
                            sortBy === s ? "var(--olive)" : "var(--text-mid)",
                          fontWeight: sortBy === s ? 600 : 400,
                          fontSize: 13,
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background:
                              sortBy === s ? "var(--olive)" : "var(--border)",
                            flexShrink: 0,
                          }}
                        />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                position: "absolute",
                left: sidebarOpen ? 228 : 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: 20,
                height: 44,
                borderRadius: "0 8px 8px 0",
                background: "var(--white)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-soft)",
                boxShadow: "2px 0 6px rgba(0,0,0,0.06)",
                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {sidebarOpen ? <IcoChevL /> : <IcoChevR />}
            </button>

            {/* Main */}
            <main
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "28px 32px 40px",
                paddingLeft: sidebarOpen ? 32 : 44,
                transition: "padding-left 0.25s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: 32,
                      fontWeight: 400,
                      color: "var(--text)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    Recipes
                  </h1>
                  <p style={{ fontSize: 13, color: "var(--text-soft)" }}>
                    <span style={{ color: "var(--text)", fontWeight: 700 }}>
                      {filtered.length}
                    </span>{" "}
                    recipe{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ViewToggle mode={viewMode} onChange={setViewMode} />
                  <button
                    onClick={() => formRef.current?.open()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "var(--olive)",
                      borderRadius: 10,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <IcoPlus /> New recipe
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <SearchBar value={search} onChange={setSearch} />
              </div>

              {viewMode === "grid" ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${sidebarOpen ? 3 : 4}, 1fr)`,
                    gap: 18,
                    transition: "grid-template-columns 0.25s",
                  }}
                >
                  {filtered.map((r, i) => (
                    <RecipeGridCard
                      key={r.id}
                      recipe={r}
                      idx={i}
                      liked={likedIds.has(r.id)}
                      onToggleLike={() => toggleLike(r.id)}
                      onDelete={() => deleteRecipe(r.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {filtered.map((r, i) => (
                    <RecipeListRow
                      key={r.id}
                      recipe={r}
                      idx={i}
                      liked={likedIds.has(r.id)}
                      onToggleLike={() => toggleLike(r.id)}
                      onDelete={() => deleteRecipe(r.id)}
                    />
                  ))}
                </div>
              )}

              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "var(--text-soft)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      marginBottom: 6,
                      color: "var(--text-mid)",
                    }}
                  >
                    No recipes found
                  </p>
                  <p style={{ fontSize: 13 }}>Try a different search</p>
                </div>
              )}
            </main>
          </div>
        </DesktopLayout>
      )}
    </div>
  );
};

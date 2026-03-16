import { getPostByIdUseCase } from "@social-networks/application/get-post-by-id.usecase";
import { getPostsUseCase } from "@social-networks/application/get-posts.usecase";
import type {
	IGetPostsParams,
	IPost,
} from "@social-networks/domain/interfaces/post.interface";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook para manejar el historial de posts
 * Proporciona funciones para listar y obtener posts individuales
 */
export const usePostsHistory = (params?: IGetPostsParams) => {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [totalPosts, setTotalPosts] = useState(0);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [isErrorPosts, setIsErrorPosts] = useState(false);
	const [errorPosts, setErrorPosts] = useState<Error | null>(null);

	// Serializar params para evitar ciclos infinitos
	const paramsRef = useRef<string>("");
	const currentParamsStr = JSON.stringify(params);

	/**
	 * Función para cargar posts desde la API
	 */
	const fetchPosts = useCallback(async () => {
		setIsLoadingPosts(true);
		setIsErrorPosts(false);
		setErrorPosts(null);

		try {
			const response = await getPostsUseCase(params);
			setPosts(response.items);
			setTotalPosts(response.total);
		} catch (error) {
			setIsErrorPosts(true);
			setErrorPosts(error as Error);
			console.error("Error fetching posts:", error);
		} finally {
			setIsLoadingPosts(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentParamsStr]); // Usar string serializado en lugar del objeto

	/**
	 * Función para obtener un post específico por ID
	 */
	const getPostById = useCallback(async (id: string): Promise<IPost | null> => {
		try {
			const post = await getPostByIdUseCase(id);
			return post;
		} catch (error) {
			console.error(`Error fetching post ${id}:`, error);
			return null;
		}
	}, []);

	/**
	 * Efecto para cargar posts cuando cambian los parámetros
	 * Solo se ejecuta si los params realmente cambiaron (comparación profunda)
	 */
	useEffect(() => {
		// Solo ejecutar si los params realmente cambiaron
		if (paramsRef.current !== currentParamsStr) {
			paramsRef.current = currentParamsStr;
			fetchPosts();
		}
	}, [currentParamsStr, fetchPosts]);

	return {
		// Lista de posts
		posts,
		totalPosts,
		isLoadingPosts,
		isErrorPosts,
		errorPosts,
		refetchPosts: fetchPosts,

		// Post individual
		getPostById,
	};
};

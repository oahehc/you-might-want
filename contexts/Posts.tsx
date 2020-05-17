import React, { createContext, useReducer, useContext } from 'react';
import { useOAuth } from '@contexts/OAuth';
import { apiUrl, getPostsApi, GetPostsResponse, postPostApi, patchVote } from '@utils/apis';
import { toggleVote } from './postsUtils';

enum Actions {
  GetPosts,
  GetPostsSuccess,
  GetPostsFail,
  GetNewPosts,
  GetNewPostsSuccess,
  GetNewPostsFail,
  CreatePost,
  CreatePostSuccess,
  CreatePostFail,
  ToggleVote,
  ToggleVoteSuccess,
  ToggleVoteFail,
}

type StateType = {
  posts: string[];
  postMap: PostMap;
  paginateKey: PostsPaginateKey | null | undefined;
  isPostLoading: boolean;
  isNewPostLoading: boolean;
  isPostCreating: boolean;
  isPostCreated: boolean;
  // TODO: API error handling
};

const initialState: StateType = {
  posts: [],
  postMap: {},
  paginateKey: undefined,
  isPostLoading: false,
  isNewPostLoading: false,
  isPostCreating: false,
  isPostCreated: false,
};

type ActionType = {
  type: Actions;
  postsResponse?: GetPostsResponse;
  post?: Post;
  togglePost?: {
    type: VoteTypes;
    postId: string;
    userId: string;
  };
};

function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Actions.GetPosts:
      return {
        ...state,
        isPostLoading: true,
      };
    case Actions.GetPostsSuccess: {
      const { postsResponse } = action;
      const { posts, postMap } = state;
      if (postsResponse?.list) {
        for (const item of postsResponse.list) {
          posts.push(item.postId);
          postMap[item.postId] = item;
        }
      }
      return {
        ...state,
        posts,
        postMap,
        isPostLoading: false,
        paginateKey: postsResponse?.lastKey,
      };
    }
    case Actions.GetPostsFail:
      return {
        ...state,
        isPostLoading: false,
      };

    case Actions.GetNewPosts:
      return {
        ...state,
        isNewPostLoading: true,
      };
    case Actions.GetNewPostsSuccess: {
      const { postsResponse } = action;
      const { posts, postMap } = state;
      if (postsResponse?.list) {
        for (const item of postsResponse.list) {
          posts.unshift(item.postId);
          postMap[item.postId] = item;
        }
      }
      return {
        ...state,
        posts,
        postMap,
        isNewPostLoading: false,
      };
    }
    case Actions.GetNewPostsFail:
      return {
        ...state,
        isNewPostLoading: false,
      };

    case Actions.CreatePost:
      return {
        ...state,
        isPostCreating: true,
        isPostCreated: false,
      };
    case Actions.CreatePostSuccess: {
      const { post } = action;
      const { posts, postMap } = state;
      if (post) {
        posts.unshift(post.postId);
        postMap[post.postId] = post;
      }
      return {
        ...state,
        posts,
        postMap,
        isPostCreating: false,
        isPostCreated: true,
      };
    }
    case Actions.CreatePostFail:
      return {
        ...state,
        isPostCreating: false,
      };

    case Actions.ToggleVote: {
      const { postMap } = state;
      const { type, postId, userId } = action?.togglePost || {};

      if (type && postId && userId) {
        postMap[postId] = toggleVote(type, userId, postMap[postId]);
      }

      return {
        ...state,
        postMap,
      };
    }
    case Actions.ToggleVoteSuccess:
      return state;
    case Actions.ToggleVoteFail: {
      const { postMap } = state;
      const { type, postId, userId } = action?.togglePost || {};

      if (type && postId && userId) {
        postMap[postId] = toggleVote(type, userId, postMap[postId]);
      }

      return {
        ...state,
        postMap,
      };
    }

    default:
      console.error('Posts: action type not exist', action);
      return state;
  }
}

const PostsContext = createContext({
  state: initialState,
  loadPosts: () => {},
  loadNewPosts: (key: PostsPaginateKey) => {},
  createPost: (s: string) => {},
  toggleVote: (type: VoteTypes, postId: string) => {},
});

export const usePostsContext = () => useContext(PostsContext);

export const PostsProvider: React.SFC = ({ children }) => {
  const { oauthState, authRequestFactory } = useOAuth();
  const authRequest = authRequestFactory(apiUrl);
  const sub = oauthState?.profile?.sub || '';
  const isLogin = oauthState?.isLogin;
  const [state, dispatch] = useReducer(reducer, initialState);
  const loadPosts = async () => {
    dispatch({ type: Actions.GetPosts });
    try {
      const res = await getPostsApi(state.paginateKey);
      dispatch({ type: Actions.GetPostsSuccess, postsResponse: res });
    } catch (e) {
      dispatch({ type: Actions.GetPostsFail });
    }
  };
  const loadNewPosts = async (paginateKey: PostsPaginateKey) => {
    dispatch({ type: Actions.GetNewPosts });
    try {
      const res = await getPostsApi(paginateKey, true);
      dispatch({ type: Actions.GetNewPostsSuccess, postsResponse: res });
    } catch (e) {
      dispatch({ type: Actions.GetNewPostsFail });
    }
  };
  const createPost = async (text: string) => {
    if (isLogin) {
      dispatch({ type: Actions.CreatePost });
      try {
        const res = await postPostApi(sub, text, authRequest);
        dispatch({ type: Actions.CreatePostSuccess, post: res.post });
      } catch (e) {
        dispatch({ type: Actions.CreatePostFail });
      }
    }
  };
  const toggleVote = async (type: VoteTypes, postId: string) => {
    if (isLogin) {
      dispatch({ type: Actions.ToggleVote, togglePost: { type, postId, userId: sub } });
      try {
        await patchVote({ type, postId }, authRequest);
        dispatch({ type: Actions.ToggleVoteSuccess });
      } catch (e) {
        dispatch({ type: Actions.ToggleVoteFail, togglePost: { type, postId, userId: sub } });
      }
    }
  };

  return (
    <PostsContext.Provider
      value={{
        state,
        loadPosts,
        loadNewPosts,
        createPost,
        toggleVote,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

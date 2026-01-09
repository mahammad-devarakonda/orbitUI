import { Post } from './components/Post/Post';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <Post
        username="joshua_tree"
        profilePic="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
        postImage="https://images.unsplash.com/photo-1469474932227-efa280385df9?w=800&h=1000&fit=crop"
        likesCount={1234}
        caption="Lost in the right direction. 🌲✨ #nature #wanderlust"
        location="Joshua Tree National Park"
        isLiked={true}
      />
    </div>
  )
}

export default App

import { MessageCircleMore } from "lucide-react";

function Welcome() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-background">
      <div className="flex h-full flex-col items-center justify-center">
        <div>
          <div className="relative m-auto flex aspect-square w-full max-w-62.5 items-center justify-center">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="250"
                cy="250"
                r="160"
                className="origin-center animate-scale-pulse fill-blue-200"
              ></circle>
            </svg>
            <div
              className={`absolute top-1/2 left-1/2 flex h-25 w-25 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-pink-500 object-cover`}
            >
              <MessageCircleMore className="h-7.5 w-7.5 text-white" />
            </div>
          </div>
          <h2
            className={
              "bg-linear-to-r from-blue-500 to-pink-500 bg-clip-text p-2 text-center text-3xl font-bold text-transparent"
            }
          >
            Chào mừng bạn đến với Messenger!
          </h2>
          <h4 className="my-3 text-center text-slate-500">Chọn một cuộc hội thoại để bắt đầu!</h4>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

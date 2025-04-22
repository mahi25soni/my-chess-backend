-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "colorWon" TEXT,
ADD COLUMN     "fen" TEXT,
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "gameHistory" TEXT[],
ADD COLUMN     "pgn" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "playerOneColor" SET DEFAULT 'white',
ALTER COLUMN "playerTwoColor" SET DEFAULT 'black';

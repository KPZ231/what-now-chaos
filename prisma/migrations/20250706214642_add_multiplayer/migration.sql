-- CreateTable
CREATE TABLE "MultiplayerGame" (
    "id" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'lobby',
    "mode" TEXT NOT NULL,
    "timerMinutes" INTEGER NOT NULL DEFAULT 5,
    "maxPlayers" INTEGER NOT NULL DEFAULT 8,
    "hostId" TEXT NOT NULL,
    "currentTaskId" TEXT,
    "currentTaskContent" TEXT,
    "currentTurn" TEXT,
    "lastTaskChange" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MultiplayerGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiplayerParticipant" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "gameId" TEXT NOT NULL,
    "userId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "turnOrder" INTEGER NOT NULL,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "tasksSkipped" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MultiplayerParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiplayerCompletedTask" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "taskContent" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "gameId" TEXT NOT NULL,
    "completedById" TEXT NOT NULL,

    CONSTRAINT "MultiplayerCompletedTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MultiplayerGame_joinCode_key" ON "MultiplayerGame"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "MultiplayerParticipant_gameId_userId_key" ON "MultiplayerParticipant"("gameId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiplayerParticipant_gameId_turnOrder_key" ON "MultiplayerParticipant"("gameId", "turnOrder");

-- AddForeignKey
ALTER TABLE "MultiplayerGame" ADD CONSTRAINT "MultiplayerGame_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerParticipant" ADD CONSTRAINT "MultiplayerParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "MultiplayerGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerParticipant" ADD CONSTRAINT "MultiplayerParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerCompletedTask" ADD CONSTRAINT "MultiplayerCompletedTask_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "MultiplayerGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
